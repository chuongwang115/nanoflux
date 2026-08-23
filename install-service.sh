#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
WORKDIR="$PWD"
OS="$(uname -s)"
LOG_DIR="${WORKDIR}/logs"
SERVICE_NAME="nanoflux"
UNIT_DIR="${HOME}/.config/systemd/user"
UNIT_FILE="${UNIT_DIR}/${SERVICE_NAME}.service"
LABEL="com.nanoflux.app"
PLIST="${HOME}/Library/LaunchAgents/${LABEL}.plist"

find_bun() {
  local bun_cmd=""
  if command -v bun >/dev/null 2>&1; then
    bun_cmd="$(command -v bun)"
  elif [[ -x "${HOME}/.bun/bin/bun" ]]; then
    bun_cmd="${HOME}/.bun/bin/bun"
  else
    return 1
  fi
  if [[ "$bun_cmd" != /* && -x "${HOME}/.bun/bin/bun" ]]; then
    bun_cmd="${HOME}/.bun/bin/bun"
  fi
  echo "$bun_cmd"
}

wait_for_port() {
  local port="$1"
  local deadline=$((SECONDS + 120))
  while (( SECONDS < deadline )); do
    if command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 "$port" 2>/dev/null; then
      return 0
    fi
    if (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.5
  done
  return 1
}

open_browser() {
  local url="$1"
  if [[ "$OS" == Darwin ]]; then
    open "$url"
    return 0
  fi
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  fi
}

BUN_CMD=""
if BUN_CMD="$(find_bun)"; then
  :
else
  echo "[ERROR] Bun not found in PATH."
  echo "Install: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  "$BUN_CMD" install
  echo
fi

echo "Building frontend (one-time before service install)..."
"$BUN_CMD" run build:web
echo

mkdir -p "$LOG_DIR"

PORT="$(bash "./scripts/read-env-port.sh")"
BUN_DIR="$(dirname "$BUN_CMD")"

install_linux() {
  if ! command -v systemctl >/dev/null 2>&1; then
    echo "[ERROR] systemctl not found. This installer needs systemd."
    exit 1
  fi

  export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
  mkdir -p "$UNIT_DIR"

  if systemctl --user is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
    echo "Stopping existing systemd user service..."
    systemctl --user stop "$SERVICE_NAME" || true
  fi

  cat > "$UNIT_FILE" <<EOF
[Unit]
Description=NanoFlux - News Service for AI Agents
After=network.target

[Service]
Type=simple
WorkingDirectory=${WORKDIR}
ExecStart=${BUN_CMD} run main.ts
Restart=always
RestartSec=3
Environment=PATH=${BUN_DIR}:/usr/local/bin:/usr/bin:/bin
StandardOutput=append:${LOG_DIR}/service-stdout.log
StandardError=append:${LOG_DIR}/service-stderr.log

[Install]
WantedBy=default.target
EOF

  echo "Loading systemd user service..."
  systemctl --user daemon-reload
  systemctl --user enable --now "$SERVICE_NAME.service"

  if command -v loginctl >/dev/null 2>&1; then
    if ! loginctl show-user "$(id -un)" -p Linger 2>/dev/null | grep -q 'Linger=yes'; then
      if loginctl enable-linger "$(id -un)" 2>/dev/null; then
        echo "Enabled lingering so the service starts at boot without a login session."
      else
        echo "[WARN] Could not enable lingering. The service starts on login, not at boot."
        echo "       Run as root: loginctl enable-linger $(id -un)"
      fi
    fi
  fi
}

install_macos() {
  mkdir -p "${HOME}/Library/LaunchAgents"

  if launchctl list 2>/dev/null | grep -q "$LABEL"; then
    echo "Stopping existing LaunchAgent..."
    launchctl bootout "gui/$(id -u)" "$PLIST" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true
  fi

  cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${BUN_CMD}</string>
    <string>run</string>
    <string>main.ts</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${WORKDIR}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/service-stdout.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/service-stderr.log</string>
</dict>
</plist>
EOF

  echo "Loading LaunchAgent..."
  launchctl bootstrap "gui/$(id -u)" "$PLIST" 2>/dev/null || launchctl load "$PLIST"
}

case "$OS" in
  Linux)
    install_linux
    echo "Waiting for server, then opening browser..."
    if wait_for_port "$PORT"; then
      open_browser "http://localhost:${PORT}/"
    else
      echo "[WARN] Server not ready in time. Open manually: http://localhost:${PORT}/"
    fi
    echo
    echo "========================================"
    echo "  NanoFlux systemd user service installed"
    echo "  Unit:    ${SERVICE_NAME}.service"
    echo "  URL:     http://localhost:${PORT}/"
    echo "  Logs:    ${LOG_DIR}"
    echo "  File:    ${UNIT_FILE}"
    echo "  Status:  systemctl --user status ${SERVICE_NAME}"
    echo "  Stop:    ./stop.sh"
    echo "========================================"
    ;;
  Darwin)
    install_macos
    echo "Waiting for server, then opening browser..."
    if wait_for_port "$PORT"; then
      open_browser "http://localhost:${PORT}/"
    else
      echo "[WARN] Server not ready in time. Open manually: http://localhost:${PORT}/"
    fi
    echo
    echo "========================================"
    echo "  NanoFlux LaunchAgent installed"
    echo "  Label:   ${LABEL}"
    echo "  URL:     http://localhost:${PORT}/"
    echo "  Logs:    ${LOG_DIR}"
    echo "  Plist:   ${PLIST}"
    echo "  Stop:    ./stop.sh"
    echo "========================================"
    ;;
  *)
    echo "[ERROR] Unsupported OS: ${OS}"
    echo "Use install-service.sh on Linux or macOS, or install-service.bat on Windows."
    exit 1
    ;;
esac

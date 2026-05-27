#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
WORKDIR="$PWD"
LABEL="com.nanoflux.app"
PLIST="${HOME}/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="${WORKDIR}/logs"

find_bun() {
  if command -v bun >/dev/null 2>&1; then
    command -v bun
    return 0
  fi
  if [[ -x "${HOME}/.bun/bin/bun" ]]; then
    echo "${HOME}/.bun/bin/bun"
    return 0
  fi
  return 1
}

wait_for_port() {
  local port="$1"
  local deadline=$((SECONDS + 120))
  while (( SECONDS < deadline )); do
    if nc -z 127.0.0.1 "$port" 2>/dev/null; then
      return 0
    fi
    sleep 0.5
  done
  return 1
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

mkdir -p "$LOG_DIR" "${HOME}/Library/LaunchAgents"

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
    <string>start:service</string>
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

PORT="$(bash "./scripts/read-env-port.sh")"

echo "Waiting for server, then opening browser..."
if wait_for_port "$PORT"; then
  open "http://localhost:${PORT}/"
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

#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
OS="$(uname -s)"

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

port_in_use() {
  local port="$1"
  if command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 "$port" 2>/dev/null; then
    return 0
  fi
  (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1
}

linux_service_active() {
  [[ "$OS" == Linux ]] || return 1
  export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
  command -v systemctl >/dev/null 2>&1 && systemctl --user is-active --quiet nanoflux 2>/dev/null
}

BUN_CMD=""
if BUN_CMD="$(find_bun)"; then
  :
else
  echo "[ERROR] Bun not found in PATH."
  echo "Install: curl -fsSL https://bun.sh/install | bash"
  echo "Then reopen Terminal and try again."
  read -r -p "Press Enter to exit..."
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  "$BUN_CMD" install
  echo
fi

PORT="$(bash "./scripts/read-env-port.sh")"

echo
echo "========================================"
echo "  About to start NanoFlux (background)"
echo "  Admin: http://localhost:${PORT}/"
echo "========================================"
echo
read -r -p "Press Enter to continue..."

if linux_service_active; then
  echo "NanoFlux systemd user service is already running."
  echo "Admin: http://localhost:${PORT}/"
  exit 0
fi

if port_in_use "$PORT"; then
  echo "NanoFlux is already running on port ${PORT}."
  echo "Admin: http://localhost:${PORT}/"
  exit 0
fi

nohup "$BUN_CMD" run start > /dev/null 2>&1 &
disown

if wait_for_port "$PORT"; then
  echo "NanoFlux is running in the background."
  echo "Admin: http://localhost:${PORT}/"
else
  echo "[WARN] Server not ready in time. Open manually: http://localhost:${PORT}/"
fi

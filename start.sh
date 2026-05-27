#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
WORKDIR="$PWD"

find_bun() {
  if command -v bun >/dev/null 2>&1; then
    echo "bun"
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
echo "  Browser: http://localhost:${PORT}/"
echo "========================================"
echo
read -r -p "Press Enter to continue..."

nohup "$BUN_CMD" run start > /dev/null 2>&1 &
disown

if wait_for_port "$PORT"; then
  open "http://localhost:${PORT}/"
else
  echo "[WARN] Server not ready in time. Open manually: http://localhost:${PORT}/"
fi

echo "NanoFlux is running in the background."

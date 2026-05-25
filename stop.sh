#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

LABEL="com.nanoflux.app"
PLIST="${HOME}/Library/LaunchAgents/${LABEL}.plist"

read_port() {
  local port="3000"
  if [[ -f .env ]]; then
    local val
    val="$(grep -E '^[[:space:]]*PORT[[:space:]]*=' .env | tail -1 | cut -d= -f2- | tr -d '\r' | xargs || true)"
    [[ -n "$val" ]] && port="$val"
  fi
  echo "$port"
}

stopped=0

if [[ -f "$PLIST" ]]; then
  if launchctl list 2>/dev/null | grep -q "$LABEL"; then
    echo "Stopping LaunchAgent ${LABEL}..."
    launchctl bootout "gui/$(id -u)" "$PLIST" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true
    stopped=1
    echo "Stopped NanoFlux LaunchAgent."
  fi
fi

PORT="$(read_port)"
pids="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"

if [[ -n "$pids" ]]; then
  echo "Stopping process on port ${PORT}..."
  # shellcheck disable=SC2086
  kill $pids 2>/dev/null || true
  sleep 1
  # shellcheck disable=SC2086
  if kill -0 $pids 2>/dev/null; then
    # shellcheck disable=SC2086
    kill -9 $pids 2>/dev/null || true
  fi
  stopped=1
  echo "Stopped NanoFlux on port ${PORT}."
fi

if [[ "$stopped" -eq 0 ]]; then
  echo "No running NanoFlux instance found (port ${PORT})."
fi

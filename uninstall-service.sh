#!/usr/bin/env bash
set -euo pipefail

OS="$(uname -s)"
SERVICE_NAME="nanoflux"
UNIT_FILE="${HOME}/.config/systemd/user/${SERVICE_NAME}.service"
LABEL="com.nanoflux.app"
PLIST="${HOME}/Library/LaunchAgents/${LABEL}.plist"

uninstall_linux() {
  export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

  if [[ ! -f "$UNIT_FILE" ]] && ! systemctl --user list-unit-files "${SERVICE_NAME}.service" --no-legend 2>/dev/null | grep -q .; then
    echo "systemd user service not installed (${UNIT_FILE} not found)."
    exit 0
  fi

  echo "Stopping systemd user service ${SERVICE_NAME}..."
  systemctl --user disable --now "${SERVICE_NAME}.service" 2>/dev/null || true
  rm -f "$UNIT_FILE"
  systemctl --user daemon-reload 2>/dev/null || true
  echo "Removed ${UNIT_FILE}"
  echo "NanoFlux systemd user service uninstalled."
}

uninstall_macos() {
  if [[ ! -f "$PLIST" ]]; then
    echo "LaunchAgent not installed (${PLIST} not found)."
    exit 0
  fi

  echo "Unloading LaunchAgent ${LABEL}..."
  launchctl bootout "gui/$(id -u)" "$PLIST" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true

  rm -f "$PLIST"
  echo "Removed ${PLIST}"
  echo "NanoFlux LaunchAgent uninstalled."
}

case "$OS" in
  Linux) uninstall_linux ;;
  Darwin) uninstall_macos ;;
  *)
    echo "[ERROR] Unsupported OS: ${OS}"
    exit 1
    ;;
esac

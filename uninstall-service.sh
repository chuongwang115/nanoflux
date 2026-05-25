#!/usr/bin/env bash
set -euo pipefail

LABEL="com.nanoflux.app"
PLIST="${HOME}/Library/LaunchAgents/${LABEL}.plist"

if [[ ! -f "$PLIST" ]]; then
  echo "LaunchAgent not installed (${PLIST} not found)."
  exit 0
fi

echo "Unloading LaunchAgent ${LABEL}..."
launchctl bootout "gui/$(id -u)" "$PLIST" 2>/dev/null || launchctl unload "$PLIST" 2>/dev/null || true

rm -f "$PLIST"
echo "Removed ${PLIST}"
echo "NanoFlux LaunchAgent uninstalled."

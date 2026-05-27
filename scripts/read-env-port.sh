#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

for f in .env .env.example; do
  if [[ -f "$f" ]]; then
    val="$(grep -E '^[[:space:]]*PORT[[:space:]]*=' "$f" | tail -1 | cut -d= -f2- | tr -d '\r' | xargs || true)"
    if [[ -n "$val" ]]; then
      echo "$val"
      exit 0
    fi
  fi
done

echo "[ERROR] PORT not set in .env or .env.example" >&2
exit 1

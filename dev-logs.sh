#!/usr/bin/env bash
# Follow the dev server logs. Pass --tail N for the last N lines without follow.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .dev.log ]; then
  echo "No .dev.log yet. Start the server with ./dev-start.sh"
  exit 1
fi

if [ "${1:-}" = "--tail" ]; then
  tail -n "${2:-50}" .dev.log
else
  echo "Following .dev.log (Ctrl-C to stop)..."
  tail -f .dev.log
fi

#!/usr/bin/env bash
# Stop the background Vite dev server started by ./dev-start.sh
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f .dev.pid ]; then
  echo "No .dev.pid found. Is the dev server running? Trying to find a stray vite..."
  pkill -f "vite" 2>/dev/null && echo "Killed stray vite process(es)." || echo "Nothing to stop."
  exit 0
fi

PID="$(cat .dev.pid)"
if kill -0 "$PID" 2>/dev/null; then
  # kill the process tree (pnpm spawns node/vite children)
  kill "$PID" 2>/dev/null || true
  pkill -P "$PID" 2>/dev/null || true
  pkill -f "vite" 2>/dev/null || true
  echo "Stopped dev server (PID $PID)."
else
  echo "Process $PID not running."
fi
rm -f .dev.pid

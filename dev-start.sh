#!/usr/bin/env bash
# Start the Vite dev server (public site + dev-only admin at /admin + local-CMS)
# in the background. Logs -> .dev.log, PID -> .dev.pid.
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .dev.pid ] && kill -0 "$(cat .dev.pid)" 2>/dev/null; then
  echo "Dev server already running (PID $(cat .dev.pid)). Use ./dev-logs.sh or ./dev-restart.sh."
  exit 0
fi

echo "Starting dev server (pnpm dev)..."
nohup pnpm dev > .dev.log 2>&1 &
echo $! > .dev.pid

# Wait (up to ~20s) for Vite to report ready.
for _ in $(seq 1 40); do
  if grep -q "ready in" .dev.log 2>/dev/null; then break; fi
  if ! kill -0 "$(cat .dev.pid)" 2>/dev/null; then
    echo "Dev server exited early. Recent logs:"; tail -n 20 .dev.log; exit 1
  fi
  sleep 0.5
done
echo "Started (PID $(cat .dev.pid))."
echo "  Site:  http://localhost:5000/"
echo "  Admin: http://localhost:5000/admin   (dev only)"
echo "  Logs:  ./dev-logs.sh    Stop: ./dev-stop.sh"

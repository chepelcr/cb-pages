#!/usr/bin/env bash
# Restart (reboot) the background Vite dev server.
set -euo pipefail
cd "$(dirname "$0")"
./dev-stop.sh
sleep 1
./dev-start.sh

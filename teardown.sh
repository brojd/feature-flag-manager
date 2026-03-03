#!/usr/bin/env bash
set -euo pipefail

RELEASE_NAME="feature-flag-manager"
PORT=3005

echo "==> Uninstalling Helm release..."
helm uninstall "$RELEASE_NAME" 2>/dev/null && echo "    Release removed." || echo "    No Helm release found, skipping."

echo "==> Killing any local feature-flag-manager processes on port ${PORT}..."
PIDS=$(lsof -ti ":${PORT}" 2>/dev/null || true)
if [ -n "$PIDS" ]; then
  kill $PIDS
  echo "    Killed PIDs: ${PIDS}"
else
  echo "    No processes found on port ${PORT}."
fi

echo "==> Done."

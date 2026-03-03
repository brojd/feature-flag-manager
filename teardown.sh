#!/usr/bin/env bash
set -euo pipefail

RELEASE_NAME="feature-flag-manager"

echo "==> Uninstalling Helm release..."
helm uninstall "$RELEASE_NAME"

echo "==> Done. Release '${RELEASE_NAME}' removed."

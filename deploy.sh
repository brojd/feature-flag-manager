#!/usr/bin/env bash
set -euo pipefail

RELEASE_NAME="feature-flag-manager"
CHART_PATH="helm/feature-flag-manager"
IMAGE="feature-flag-manager"
TAG="latest"
LOCAL_PORT=3005
CONTAINER_PORT=3005

echo "==> Building Docker image..."
docker build -t "${IMAGE}:${TAG}" .

echo "==> Installing/upgrading Helm release..."
helm upgrade --install "$RELEASE_NAME" "$CHART_PATH" \
  --set image.repository="$IMAGE" \
  --set image.tag="$TAG"

echo "==> Waiting for pod to be ready..."
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/name=feature-flag-manager \
  --timeout=60s

echo "==> Port-forwarding to localhost:${LOCAL_PORT}..."
echo "    Press Ctrl+C to stop."
kubectl port-forward svc/"$RELEASE_NAME" "${LOCAL_PORT}:80"

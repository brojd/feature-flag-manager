# Feature Flag Manager

A simple feature flag manager service built with TypeScript and Express. Stores boolean feature flags in memory with a REST API for CRUD operations. Includes a Helm chart for Kubernetes deployment.

## Quick Start

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000`.

## API

All flag endpoints use JSON. Flag shape:

```json
{ "key": "dark-mode", "enabled": true, "description": "Enable dark mode" }
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/flags | List all flags |
| GET | /api/flags/:key | Get a flag |
| POST | /api/flags | Create a flag |
| PATCH | /api/flags/:key | Update a flag |
| DELETE | /api/flags/:key | Delete a flag |

### Examples

```bash
# Create a flag
curl -X POST localhost:3000/api/flags \
  -H 'Content-Type: application/json' \
  -d '{"key": "dark-mode", "enabled": true, "description": "Enable dark mode"}'

# List all flags
curl localhost:3000/api/flags

# Get a single flag
curl localhost:3000/api/flags/dark-mode

# Toggle a flag
curl -X PATCH localhost:3000/api/flags/dark-mode \
  -H 'Content-Type: application/json' \
  -d '{"enabled": false}'

# Delete a flag
curl -X DELETE localhost:3000/api/flags/dark-mode
```

## Docker

```bash
docker build -t feature-flag-manager .
docker run -p 3000:3000 feature-flag-manager
```

## Deploy to Kubernetes

Build, deploy, and port-forward in one command:

```bash
./deploy.sh
```

This will:
1. Build the Docker image
2. Install (or upgrade) the Helm release
3. Wait for the pod to be ready
4. Port-forward to `localhost:3000`

To stop the service and uninstall the Helm release:

```bash
./teardown.sh
```

### Manual Helm install

```bash
helm install feature-flag-manager helm/feature-flag-manager
```

To customize the deployment, override values:

```bash
helm install ffm helm/feature-flag-manager \
  --set image.repository=my-registry/feature-flag-manager \
  --set image.tag=v1.0.0 \
  --set replicaCount=3 \
  --set ingress.enabled=true
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with ts-node (development) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled JS (production) |

## Notes

- Flags are stored in memory and reset on restart.
- The `PORT` environment variable overrides the default port (3000).

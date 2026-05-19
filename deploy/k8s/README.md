# Kubernetes Local Demo

This directory contains Kubernetes manifests for the Website Builder application layer.

The manifests are intended for interview/demo deployment design and local validation with `kubectl --dry-run=client` or a local cluster such as Kind/Minikube.

## Scope

Included:

- Namespace
- ConfigMap for non-secret runtime config
- Secret example for credentials
- Backend Deployment and Service
- Frontend Deployment and Service
- Ingress routing
- Health probes
- `kustomization.yaml`

Not included:

- Production PostgreSQL StatefulSet
- Production Redis StatefulSet
- Persistent volume design
- TLS certificate issuer

For production, PostgreSQL and Redis should normally be external managed services or separately operated platform dependencies.

## Images

The manifests reference local/demo images:

```text
website-builder-server:local
website-builder-web:local
```

Build them with the existing Docker setup before applying to a local cluster:

```bash
docker compose -f docker/docker-compose.full.yml build server web
```

For Kind, load images into the cluster:

```bash
kind load docker-image website-builder-server:local
kind load docker-image website-builder-web:local
```

## Validate

```bash
make k8s-validate
```

The validation uses `kubectl kustomize deploy/k8s` so it can run even when the local Kubernetes API server is not available.

## Apply

```bash
kubectl apply -k deploy/k8s
```

## Routes

The default Ingress host is:

```text
website-builder.local
```

Routes:

- `/api` -> backend
- `/actuator` -> backend
- `/uploads` -> backend
- `/` -> frontend

For local testing, add a hosts entry pointing `website-builder.local` to the local ingress controller address.

## Security Notes

`secret.example.yaml` contains demo values only. Replace them before using a shared environment.

# MLOps Framework

An open-source, self-hosted MLOps framework intended to reduce friction in
machine-learning training, evaluation, and inference workflows.

The framework aims to make ML experiments portable and reproducible through
containerized execution, experiment tracking, dataset and model management,
and automated training workflows.

YOLO-based computer-vision workloads will be used as the initial reference
implementation and demonstration.

## Status

**Phase 0 — Product shell**

The repository currently contains the Release 0 clickable mock frontend. It
demonstrates the intended product flow with browser-local fixture data; no
backend or MLOps functionality has been implemented.

See [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md) for active scope and
[`frontend/README.md`](frontend/README.md) for mock behavior and routes.

## Development

### Requirements

- [Bun](https://bun.sh/)

### Run the frontend

```bash
cd frontend
bun install
bun dev
```

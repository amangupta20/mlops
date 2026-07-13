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

The repository currently contains a Next.js frontend scaffold using Bun.
The backend and MLOps functionality have not been implemented yet.

## Development

### Requirements

- [Bun](https://bun.sh/)

### Run the frontend

```bash
cd frontend
bun install
bun dev
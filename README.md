# MLOps Framework

An open-source, self-hosted MLOps workspace for computer-vision training,
evaluation, model management, and inference workflows. YOLO object detection
is the initial reference workload.

## Current status

This repository currently contains two independently runnable applications:

- A Release 0 Next.js product shell that demonstrates the intended MLOps
  workflows with browser-local mock data.
- A FastAPI inference backend that loads three local Ultralytics YOLO models,
  accepts JPEG or PNG uploads, and returns annotated JPEG images with
  structured detections.

Only the frontend inference screen is connected to the backend. Dataset
management, real training, experiment tracking, model registration,
orchestration, and system status remain simulated frontend workflows or future
scope.

## Repository layout

```text
mlops/
├── backend/                  # FastAPI YOLO inference service
│   ├── app/                  # Routes, model IDs, and inference logic
│   ├── models/               # Local YOLO model weights
│   ├── README.md             # Backend setup and API reference
│   └── pyproject.toml
├── frontend/                 # Next.js Release 0 product shell
│   ├── src/
│   ├── README.md             # Frontend routes and mock behavior
│   └── package.json
├── docs/                     # Product plan and design documentation
└── AI_USE.md                 # Project AI-use disclosure
```

## Requirements

### Backend

- Python 3.12 or newer
- [`uv`](https://docs.astral.sh/uv/)
- Sufficient CPU/GPU memory to load the included YOLO weights

### Frontend

- [`Bun`](https://bun.sh/)

## Quick start

The frontend and backend currently run as separate applications. Start each in
its own terminal.

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

The backend is then available at:

- API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

Run the backend from the `backend/` directory because model paths are currently
resolved relative to that directory. See the
[backend README](backend/README.md) for request examples, supported models,
validation behavior, and concurrency details.

### Frontend

```bash
cd frontend
bun install
bun dev
```

Open `http://localhost:3000`. The inference screen sends the selected image to
the FastAPI API through the frontend's `/infer` proxy. See the
[frontend README](frontend/README.md) for available routes and behavior.

## Development checks

Run backend checks from `backend/`:

```bash
uv run ruff check app
uv run ruff format --check app
uv run pytest
```

Run frontend checks from `frontend/`:

```bash
bun run test -- --run
bun lint
bun run build
```

## Implemented backend API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Report that the API process is running |
| `POST` | `/infer` | Run a selected YOLO model on an uploaded image |

The inference endpoint supports `yolo26n`, `yolo26s`, and `yolo26m`, with a
configurable confidence threshold. See the
[backend API documentation](backend/README.md#api) for the complete contract.

## Documentation

- [Backend setup and API reference](backend/README.md)
- [Frontend routes and mock behavior](frontend/README.md)
- [MLOps master plan](docs/FOSS_YOLO_MLOps_Master_Plan.md)
- [Frontend product-shell design](docs/design/frontend-product-shell.md)
- [AI-use disclosure](AI_USE.md)

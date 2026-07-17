# MLOps Inference Backend

FastAPI service for running object detection with Ultralytics YOLO models. The
service accepts a JPEG or PNG upload, performs inference with a selected model,
draws the detections, and returns the annotated image as JPEG data.

## Requirements

- Python 3.12 or newer
- [`uv`](https://docs.astral.sh/uv/)
- Enough system or GPU memory to load all three YOLO models at startup

The model weights are expected at:

```text
models/yolo26n.pt
models/yolo26s.pt
models/yolo26m.pt
```

## Setup

Run the following commands from this `backend/` directory:

```bash
uv sync
```

Start the development server with:

```bash
uv run uvicorn app.main:app --reload
```

The application currently resolves model paths relative to the working
directory, so start it from `backend/`, not from the repository root.

Once running, the service is available at `http://127.0.0.1:8000`.

- Swagger UI: `http://127.0.0.1:8000/docs`
- OpenAPI schema: `http://127.0.0.1:8000/openapi.json`
- Health check: `http://127.0.0.1:8000/health`

## API

### Health check

```http
GET /health
```

Example:

```bash
curl http://127.0.0.1:8000/health
```

Response:

```json
{"status":"healthy"}
```

The health endpoint reports that the web application is running. It does not
perform a test prediction.

### Run inference

```http
POST /infer
Content-Type: multipart/form-data
```

Form fields:

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `image` | file | Yes | — | JPEG or PNG image, up to 10 MiB |
| `model_name` | string | No | `yolo26n` | `yolo26n`, `yolo26s`, or `yolo26m` |
| `confidence` | number | No | `0.25` | Detection threshold from `0.0` to `1.0` |

Example using the default model and confidence:

```bash
curl -X POST http://127.0.0.1:8000/infer \
  -F "image=@example.jpg"
```

Example selecting a model and confidence threshold:

```bash
curl -X POST http://127.0.0.1:8000/infer \
  -F "image=@example.png" \
  -F "model_name=yolo26s" \
  -F "confidence=0.4"
```

A successful response has the media type `application/json`. The `image`
object contains the annotated JPEG as base64, while `detections` contains real
model results with normalized `xyxy` coordinates:

```json
{
  "image": {
    "content_type": "image/jpeg",
    "base64": "/9j/4AAQSk..."
  },
  "detections": [
    {
      "class_id": 0,
      "label": "person",
      "confidence": 0.9432,
      "box": { "x1": 0.12, "y1": 0.08, "x2": 0.47, "y2": 0.9 }
    }
  ]
}
```

Coordinates range from `0.0` to `1.0`. The response also includes:

| Header | Description |
| --- | --- |
| `X-Processing-Time` | Total request processing time in milliseconds |
| `X-Model-Used` | Model identifier used for the prediction |

## Validation and errors

| Status | Meaning |
| --- | --- |
| `413` | The declared upload size exceeds 10 MiB |
| `415` | The upload content type is not `image/jpeg` or `image/png` |
| `422` | A form value is invalid, a required field is missing, or the uploaded bytes cannot be decoded as an image |
| `500` | An unexpected model, encoding, or server error occurred |

The content-type check is followed by actual Pillow decoding, so a file named
like an image or sent with an image content type is still rejected if its bytes
are malformed.

## Concurrency model

Upload reading is asynchronous. Pillow decoding, YOLO prediction, annotation,
and OpenCV JPEG encoding are synchronous operations and run in a worker thread
through `asyncio.to_thread()` so they do not block FastAPI's event loop.

An `asyncio.Semaphore(5)` allows at most five inference pipelines to run at the
same time. Additional requests wait asynchronously for a slot. This limit does
not guarantee that five concurrent predictions are optimal for the available
CPU, GPU, or memory; tune it in `app/main.py` after measuring throughput and
resource usage. A limit of one is the safest starting point for a single GPU.

All model weights are loaded once during application startup and shared between
requests. The application will not begin accepting requests if any configured
model file cannot be loaded.

## Project layout

```text
backend/
├── app/
│   ├── domain/
│   │   └── model_ids.py       # Supported model identifiers
│   ├── services/
│   │   └── inference.py       # Model loading and inference pipeline
│   └── main.py                # FastAPI routes and application lifecycle
├── models/
│   ├── yolo26m.pt
│   ├── yolo26n.pt
│   └── yolo26s.pt
├── pyproject.toml
└── uv.lock
```

## Development commands

Install all runtime and development dependencies:

```bash
uv sync --all-groups
```

Run Ruff checks:

```bash
uv run ruff check app
```

Apply Ruff formatting:

```bash
uv run ruff format app
```

Run tests when a test suite is present:

```bash
uv run pytest
```

# Release 0 mock frontend

This Next.js application is the clickable product shell for Release 0. It
demonstrates the intended MLOps workspace with browser-local fixtures before a
backend or technical core exists.

## Run locally

Requires [Bun](https://bun.sh/).

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

The inference screen proxies only `POST /infer` to
`http://127.0.0.1:8000/infer` by default. Set `INFERENCE_BACKEND_URL` before
starting or building the frontend when FastAPI is hosted elsewhere:

```bash
INFERENCE_BACKEND_URL=http://backend:8000 bun dev
```

## Checks

```bash
bun run test -- --run
bun lint
bun run build
```

## Screens

| Route | Screen |
| --- | --- |
| `/` | Dashboard |
| `/inference` | Inference |
| `/datasets` | Dataset inventory |
| `/datasets/validation` | Dataset validation result |
| `/training` | Training configuration |
| `/training/active` | Active training run |
| `/runs` | Run history |
| `/runs/details` | Run details |
| `/models` | Model registry |
| `/system` | System status |

## Behavior

- A local JPEG or PNG can be submitted to `POST /infer`. The annotated JPEG,
  real detection labels, confidence scores, model name, and processing time are
  displayed from the API response.
- Training progresses automatically from queued to completed in about 24
  seconds.
- Completing training adds one candidate model to the registry.
- Training runs and created model metadata persist in browser local storage so
  navigation and refreshes do not reset the demo.
- `Reset demo state` on the active-run screen clears browser-local additions.

## Boundaries

Only the inference screen is connected to a backend. The frontend does not
connect dataset, training, run, model-registry, or system-status screens, call
health endpoints, or persist server data. Those workflows remain illustrative
Release 0 fixtures.

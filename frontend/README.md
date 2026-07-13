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

## Mock behavior

- A local JPEG, PNG, or WebP can be previewed and submitted for simulated
  inference. The image is not uploaded or stored.
- Training progresses automatically from queued to completed in about 24
  seconds.
- Completing training adds one candidate model to the registry.
- Training runs and created model metadata persist in browser local storage so
  navigation and refreshes do not reset the demo.
- `Reset demo state` on the active-run screen clears browser-local additions.

## Boundaries

This frontend does not perform inference, ingest or validate datasets, train a
model, call health endpoints, define backend contracts, or persist server data.
All domain records, metrics, logs, artifacts, and system values are illustrative
Release 0 fixtures.

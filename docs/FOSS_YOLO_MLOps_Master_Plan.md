# FOSS YOLO MLOps Framework — Implementation Master Plan

> **Purpose:** Build a self-hosted, open-source MLOps framework that uses YOLO/computer vision as the first demonstration workload while keeping the core architecture reusable for other ML workloads later.

---

## 0. How to use this document

This is the authoritative build plan.

For every work session:

1. Open this file.
2. Open `CURRENT_RELEASE.md`.
3. Work only on the active release.
4. Put new ideas into the **Parking Lot** instead of implementing them immediately.
5. Do not move forward until the current release satisfies its acceptance criteria.

The product vision may grow. The active release must remain controlled.

---

# 1. Product thesis

## 1.1 What the project is

A self-hosted platform where a user can:

- upload and inspect datasets;
- run model inference;
- submit training jobs;
- track runs, metrics, logs, and artifacts;
- compare experiments;
- manage trained models;
- observe system behavior;
- deploy the stack on their own hardware.

YOLO is the first workload because it makes MLOps problems unusually visible:

- large datasets;
- expensive training;
- large model artifacts;
- GPU scheduling and utilization;
- reproducibility requirements;
- visually understandable outputs;
- measurable training and inference performance.

## 1.2 What the first version is not

The first version is not:

- a universal ML platform;
- a replacement for Kubeflow, SageMaker, Vertex AI, or Databricks;
- a multi-cloud control plane;
- a distributed training platform;
- an arbitrary-code execution service;
- a frontend portfolio project;
- a SaaS product hosted by you.

## 1.3 Consulting relevance

The long-term service thesis is:

> Help small AI teams turn manual ML workflows into reproducible, automated, observable, self-hosted pipelines inside their own infrastructure.

The consultancy may remain general MLOps. YOLO is the first reference implementation, not the permanent market boundary.

---

# 2. Ownership and AI-use policy

## 2.1 Ownership rule

A component is yours when you:

- define why it exists;
- define its behavior and guarantees;
- understand its failure modes;
- review and validate the implementation;
- can modify it confidently;
- remain responsible for maintaining it.

Typing every line manually is not required. Blindly accepting generated code is not acceptable.

## 2.2 AI-use modes

### AI-led

AI may produce most of the implementation.

Suitable for:

- UI components;
- CSS and styling;
- frontend layout;
- repetitive frontend form logic;
- icons and visual polish;
- mock data;
- chart presentation;
- basic frontend API clients.

You still define:

- user flow;
- screen purpose;
- UI states;
- API contracts;
- validation behavior;
- acceptance criteria.

### AI-assisted

You lead the design. AI may help with syntax, debugging, review, tests, or small implementation pieces.

Suitable for:

- request/response schemas;
- configuration parsing;
- routine CRUD;
- Dockerfiles;
- Compose files;
- CI configuration;
- test fixtures;
- Prometheus instrumentation;
- logging setup;
- dependency troubleshooting.

### Human-led

You define and substantially implement the component.

Use for:

- run state machine;
- training orchestration;
- dataset identity and lifecycle;
- artifact lineage;
- workload adapter design;
- storage abstraction;
- retry and cancellation semantics;
- worker architecture;
- model promotion rules;
- reproducibility guarantees;
- security boundaries;
- JuiceFS integration rationale;
- distributed execution decisions.

AI may explain, critique, review, and troubleshoot these components.

## 2.3 Never accept blindly

Always manually review:

- authentication and authorization;
- archive extraction;
- filesystem paths;
- file uploads;
- arbitrary code execution;
- secrets;
- container privileges;
- Docker socket access;
- IAM policies;
- network exposure;
- database migrations;
- destructive infrastructure commands;
- client data handling.

## 2.4 Repository transparency

Create `AI_USE.md` and record:

- which areas are AI-led;
- which are AI-assisted;
- which are human-led;
- important AI-generated components;
- major decisions you made personally.

This is an engineering record, not an apology.

---

# 3. Architecture principles

## 3.1 Build vertically

Every release must create one visible end-to-end capability.

Avoid:

```text
Backend complete
→ frontend complete
→ workers complete
→ observability complete
→ finally usable
```

Prefer:

```text
One complete feature
→ visible result
→ persistence
→ next complete feature
```

## 3.2 Generic core, YOLO adapter

The system should separate generic MLOps concepts from YOLO-specific logic.

### Generic concepts

- run;
- dataset;
- parameters;
- metrics;
- artifacts;
- logs;
- resources;
- model;
- deployment;
- storage backend.

### YOLO-specific concepts

- Ultralytics model family;
- `data.yaml`;
- class labels;
- bounding boxes;
- mAP;
- confidence threshold;
- YOLO weights;
- YOLO callbacks.

YOLO assumptions should live inside a workload adapter instead of leaking through the whole application.

## 3.3 Correct for current requirements

Use the smallest architecture that satisfies the active release correctly.

Do not design for imaginary traffic or imaginary clients.

## 3.4 Evidence before expansion

A new technology enters the main architecture only when:

- the current design cannot meet a requirement;
- a benchmark proves meaningful value;
- it creates a necessary security or reliability boundary;
- it is a deliberate learning objective whose cost is understood.

---

# 4. Core domain model

Define these concepts before writing the backend.

## 4.1 Dataset

A dataset should eventually contain:

- dataset ID;
- name;
- version;
- content hash;
- source;
- storage URI;
- classes;
- validation status;
- validation report;
- image count;
- label count;
- total size;
- creation timestamp.

## 4.2 Run

A run is a traceable operation.

Possible run types:

- inference;
- validation;
- training;
- evaluation;
- deployment.

A run should eventually contain:

- run ID;
- run type;
- workload adapter;
- status;
- input references;
- immutable configuration;
- start and end timestamps;
- logs;
- metrics;
- artifacts;
- error details;
- code version;
- environment metadata;
- hardware metadata.

## 4.3 Model

A model should eventually contain:

- model ID;
- name;
- version;
- source run;
- base model;
- content hash;
- framework;
- task type;
- metrics;
- artifact URI;
- lifecycle state;
- creation timestamp.

Possible lifecycle states:

```text
candidate
→ validated
→ approved
→ deployed
→ archived
```

## 4.4 Artifact

Artifacts may include:

- images;
- dataset archives;
- validation reports;
- checkpoints;
- weights;
- logs;
- metric files;
- configuration snapshots;
- deployment packages.

Each artifact should have:

- artifact ID;
- type;
- storage URI;
- content hash;
- size;
- source run;
- creation timestamp.

---

# 5. Initial repository structure

Start simpler than the original generated plan.

```text
foss-yolo-pipeline/
├── README.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── AI_USE.md
├── CURRENT_RELEASE.md
├── .gitignore
│
├── docs/
│   ├── product-flow.md
│   ├── entities.md
│   ├── security-model.md
│   └── decisions/
│       └── ADR-0001-example.md
│
├── backend/
│   ├── pyproject.toml
│   ├── src/
│   │   └── app/
│   │       ├── main.py
│   │       ├── api/
│   │       ├── domain/
│   │       ├── services/
│   │       ├── adapters/
│   │       │   └── yolo/
│   │       ├── persistence/
│   │       └── config/
│   └── tests/
│
├── web-ui/
│   ├── src/
│   └── tests/
│
├── storage/
│   ├── uploads/
│   ├── artifacts/
│   ├── datasets/
│   └── models/
│
└── deploy/
    ├── compose/
    ├── prometheus/
    └── grafana/
```

Do not create every empty directory immediately. Create directories as their release requires them.

---

# 6. Release ladder

## Release 0 — Product shell and contracts

**Target duration:** 1–2 days

### Goal

Turn the idea into a navigable product shell before implementing the technical core.

### Deliverables

- repository initialized;
- `README.md`;
- `ROADMAP.md`;
- `ARCHITECTURE.md`;
- `AI_USE.md`;
- product-flow document;
- core entities documented;
- clickable UI with mocked data.

### Required UI screens

- dashboard;
- inference;
- datasets;
- dataset validation result;
- training configuration;
- active training run;
- run history;
- run details;
- model registry;
- system status.

### Steps

- [ ] Write the project statement.
- [ ] Write non-goals.
- [ ] Define dataset, run, model, and artifact.
- [ ] Draw the user flow.
- [ ] Define UI states.
- [ ] Define mock API responses.
- [ ] Use AI to generate the initial UI.
- [ ] Review every screen.
- [ ] Remove unnecessary visual complexity.
- [ ] Record screenshots.
- [ ] Tag release `v0.0.1-ui-shell`.

### Acceptance criteria

- [ ] The UI runs locally.
- [ ] Every screen is reachable.
- [ ] Mock inference can be submitted.
- [ ] Mock training can be submitted.
- [ ] A mock active run changes state.
- [ ] A mock completed model appears in the registry.
- [ ] The product flow is understandable without reading code.

### Feedback loop

You can see and navigate the intended product.

### AI boundary

AI-led frontend implementation. Human-led product flow and contracts.

### Stop condition

Do not polish the UI beyond what is required for the next release.

---

## Release 1 — Real inference loop

**Target duration:** 2–4 days

### Goal

Replace the mocked inference path with real YOLO inference.

### User flow

```text
Upload image
→ select model
→ configure confidence
→ submit
→ receive detections
→ display annotated image
→ inspect timing
```

### Backend responsibilities

- accept JPEG/PNG;
- validate content type and size;
- decode safely;
- select an allowed model;
- run inference;
- produce structured detections;
- generate annotated output;
- record timing;
- return artifact references.

### Suggested response shape

```json
{
  "run_id": "uuid",
  "status": "completed",
  "model": {
    "id": "model-id",
    "name": "yolo11n"
  },
  "timing_ms": {
    "preprocess": 0,
    "inference": 0,
    "postprocess": 0,
    "total": 0
  },
  "detections": [],
  "artifacts": {
    "input_image": "uri",
    "annotated_image": "uri"
  }
}
```

### Steps

- [ ] Define the inference API contract.
- [ ] Define allowed image types and size limits.
- [ ] Implement model loading.
- [ ] Implement model allow-listing.
- [ ] Implement inference.
- [ ] Implement structured detection output.
- [ ] Save annotated output.
- [ ] Connect UI to backend.
- [ ] Add error states.
- [ ] Add one end-to-end test.
- [ ] Record a demo.
- [ ] Tag release `v0.1.0-inference`.

### Acceptance criteria

- [ ] A valid image produces detections.
- [ ] The annotated image is visible in the UI.
- [ ] Invalid file types are rejected.
- [ ] Oversized files are rejected.
- [ ] Unknown model names are rejected.
- [ ] Backend errors are visible in the UI.
- [ ] Inference timing is shown.
- [ ] Repeated requests do not reload the model unnecessarily.

### Feedback loop

Every backend change is visible through a real UI action.

### AI boundary

Human-led API contract and model lifecycle. AI-assisted library syntax and tests. AI-led UI implementation.

---

## Release 2 — Persistent run history

**Target duration:** 2–4 days

### Goal

Make inference runs persistent and inspectable.

### Initial database

Use SQLite unless a requirement proves it insufficient.

### Required fields

- run ID;
- type;
- status;
- model reference;
- configuration;
- timestamps;
- metrics;
- artifact references;
- error details.

### Steps

- [ ] Design the run table.
- [ ] Define run status values.
- [ ] Persist completed inference runs.
- [ ] Persist failed runs.
- [ ] Add run-history endpoint.
- [ ] Add run-details endpoint.
- [ ] Connect history UI.
- [ ] Add migration mechanism.
- [ ] Add restart-persistence test.
- [ ] Tag release `v0.2.0-run-history`.

### Acceptance criteria

- [ ] Completed runs survive restart.
- [ ] Failed runs survive restart.
- [ ] Run details show configuration, timing, detections, and artifacts.
- [ ] Missing artifacts are handled cleanly.
- [ ] Run IDs are not derived from filenames.
- [ ] Historical runs can be opened through the UI.

### Feedback loop

The application accumulates evidence of its own behavior.

### AI boundary

Human-led run model and state semantics. AI-assisted persistence boilerplate.

---

## Release 3 — Model management

**Target duration:** 3–5 days

### Goal

Manage model artifacts without editing filesystem paths manually.

### Features

- built-in models;
- custom weights upload;
- model metadata;
- content hashing;
- validation;
- controlled model cache;
- model list;
- model details.

### Steps

- [ ] Define model entity.
- [ ] Define lifecycle states.
- [ ] Register built-in models.
- [ ] Implement custom weights upload.
- [ ] Validate type and readability.
- [ ] Compute content hash.
- [ ] Store metadata.
- [ ] Add model registry UI.
- [ ] Add cache limits or eviction policy.
- [ ] Add corruption and traversal tests.
- [ ] Tag release `v0.3.0-model-registry`.

### Acceptance criteria

- [ ] A valid model can be registered.
- [ ] Duplicate content is detected.
- [ ] Corrupted weights are rejected.
- [ ] Path traversal is impossible.
- [ ] Models can be selected for inference.
- [ ] Cache behavior is visible or measurable.

### Feedback loop

Models become visible first-class assets.

### AI boundary

Human-led model identity and lifecycle. AI-assisted upload and validation mechanics.

---

## Release 4 — Dataset ingestion and validation

**Target duration:** 4–7 days

### Goal

Upload a YOLO dataset and receive an interactive validation report.

### Validation checks

- archive format;
- archive traversal attempts;
- decompression size limits;
- `data.yaml` presence;
- train/validation paths;
- image readability;
- label readability;
- label syntax;
- image-label pairing;
- class ID validity;
- empty labels;
- duplicate files;
- class distribution;
- image dimensions;
- total size.

### Steps

- [ ] Define dataset entity.
- [ ] Define dataset version identity.
- [ ] Define validation report schema.
- [ ] Implement safe archive extraction.
- [ ] Implement structural validation.
- [ ] Implement image validation.
- [ ] Implement label validation.
- [ ] Compute content hash.
- [ ] Persist metadata.
- [ ] Build validation-report UI.
- [ ] Add malicious archive tests.
- [ ] Tag release `v0.4.0-dataset-validation`.

### Acceptance criteria

- [ ] A valid dataset is accepted.
- [ ] Invalid `data.yaml` is explained.
- [ ] Missing labels are reported.
- [ ] Invalid class IDs are reported.
- [ ] Zip-slip/path traversal is blocked.
- [ ] Excessive decompression is blocked.
- [ ] The report is visible in the UI.
- [ ] Dataset identity does not rely only on filename.

### Go decision checkpoint

Do not automatically add Go.

Run an experiment comparing Python and Go for:

- large streaming uploads;
- memory use;
- throughput;
- failure handling;
- security validation;
- implementation complexity.

Record the decision in an ADR.

### Feedback loop

Uploading a dataset produces a rich visible result before training exists.

### AI boundary

Human-led validation rules and security model. AI-assisted parsing and tests.

---

## Release 5 — Training job version 1

**Target duration:** 5–10 days

### Goal

Launch one training job on one worker and observe it through the UI.

### Required states

```text
created
→ queued
→ preparing
→ running
→ evaluating
→ completed
```

Failure states:

```text
failed
cancelled
interrupted
```

### Required behavior

- immutable training configuration;
- persistent job record;
- log capture;
- progress updates;
- checkpoint storage;
- final metrics;
- final weights;
- cancellation;
- restart/interruption handling.

### Steps

- [ ] Define training configuration schema.
- [ ] Define state machine.
- [ ] Define legal state transitions.
- [ ] Implement persistent job creation.
- [ ] Implement one worker.
- [ ] Implement dataset preparation.
- [ ] Run YOLO training.
- [ ] Capture logs.
- [ ] Capture epoch progress.
- [ ] Capture metrics.
- [ ] Save checkpoints and final weights.
- [ ] Implement cancellation.
- [ ] Implement interrupted-run handling.
- [ ] Connect active-run UI.
- [ ] Add end-to-end training test with a tiny dataset.
- [ ] Tag release `v0.5.0-training`.

### Acceptance criteria

- [ ] A validated dataset can launch training.
- [ ] Configuration cannot change after launch.
- [ ] Progress is visible.
- [ ] Logs are visible.
- [ ] Failed jobs have useful error details.
- [ ] Cancellation reaches a stable terminal state.
- [ ] Final weights become a model artifact.
- [ ] Restart does not silently mark an interrupted job as completed.

### Queue decision checkpoint

Do not introduce Celery and Redis only because training is asynchronous.

Add a queue system when you need:

- multiple workers;
- stronger delivery guarantees;
- job priorities;
- retries;
- remote execution;
- worker discovery.

Record the decision in an ADR.

### Feedback loop

You can start training and watch a model emerge.

### AI boundary

Human-led orchestration, state machine, cancellation, and persistence. AI-assisted library integration and tests.

---

## Release 6 — Reproducibility and experiment comparison

**Target duration:** 4–7 days

### Goal

Make training runs reproducible and comparable.

### Required lineage

- code commit;
- dataset ID and hash;
- base-model ID and hash;
- configuration snapshot;
- dependency/environment identity;
- hardware information;
- random seed;
- metrics;
- artifacts;
- logs.

### Features

- experiment grouping;
- run comparison;
- metric charts;
- configuration diff;
- lineage view;
- reproducibility report.

### MLflow decision checkpoint

Evaluate MLflow after actual tracking requirements are known.

Ask:

- Does it replace useful custom work?
- Does it self-host cleanly?
- Does it simplify artifacts and metrics?
- Does it introduce unnecessary operational weight?
- What remains your responsibility?

### Steps

- [ ] Define reproducibility contract.
- [ ] Capture code version.
- [ ] Capture environment identity.
- [ ] Capture hardware details.
- [ ] Capture random seed.
- [ ] Group runs into experiments.
- [ ] Add run comparison.
- [ ] Generate reproducibility report.
- [ ] Evaluate MLflow.
- [ ] Record MLflow decision.
- [ ] Tag release `v0.6.0-reproducibility`.

### Acceptance criteria

- [ ] Two runs can be compared.
- [ ] Configuration differences are visible.
- [ ] Dataset and model lineage are visible.
- [ ] A completed run has enough metadata to attempt reproduction.
- [ ] Missing reproducibility fields are explicitly reported.

### Feedback loop

Experiments become comparable instead of isolated.

### AI boundary

Human-led lineage and reproducibility guarantees. AI-assisted charts and integrations.

---

## Release 7 — Self-hosted distribution

**Target duration:** 4–7 days

### Goal

Allow another person to install and use the framework on clean hardware.

### Required profiles

- CPU-only;
- optional NVIDIA GPU.

### Required documentation

- prerequisites;
- installation;
- configuration;
- storage paths;
- health checks;
- upgrade process;
- backup;
- restore;
- uninstall;
- troubleshooting.

### Steps

- [ ] Containerize backend.
- [ ] Containerize UI.
- [ ] Add persistent volumes.
- [ ] Add health checks.
- [ ] Add CPU Compose profile.
- [ ] Add GPU Compose profile.
- [ ] Add configuration schema.
- [ ] Add sample dataset.
- [ ] Add installation validation command.
- [ ] Test on a clean VM.
- [ ] Destroy and reinstall.
- [ ] Restore from backup.
- [ ] Tag release `v0.7.0-self-hosted`.

### Acceptance criteria

- [ ] Fresh VM installation works from documentation alone.
- [ ] CPU inference works.
- [ ] GPU inference works where supported.
- [ ] One tiny training run works.
- [ ] Persistent data survives restart.
- [ ] Backup and restore are verified.
- [ ] Uninstall does not remove user data without explicit confirmation.

### Feedback loop

The project stops being tied to your development environment.

### AI boundary

AI-assisted Docker and documentation review. Human-led persistence and operational guarantees.

---

## Release 8 — Observability

**Target duration:** 3–5 days

### Goal

Observe real system behavior using metrics discovered during previous releases.

### Candidate metrics

- request count;
- request failures;
- inference latency;
- model load time;
- training duration;
- queue depth;
- active jobs;
- failed jobs;
- cancellation count;
- CPU;
- memory;
- GPU utilization;
- GPU memory;
- disk usage;
- artifact growth;
- upload throughput.

### Steps

- [ ] Define metric names and meanings.
- [ ] Instrument backend.
- [ ] Instrument worker.
- [ ] Add Prometheus.
- [ ] Add Grafana.
- [ ] Provision dashboards.
- [ ] Add alerts only for meaningful conditions.
- [ ] Record one training-run dashboard.
- [ ] Tag release `v0.8.0-observability`.

### Acceptance criteria

- [ ] Metrics have documented meaning.
- [ ] Grafana provisions automatically.
- [ ] Training activity is visible.
- [ ] Inference latency is visible.
- [ ] Failures are visible.
- [ ] Metrics do not expose sensitive paths or data.

### Feedback loop

The system becomes a live infrastructure object you can inspect.

### AI boundary

Human-led metric selection and interpretation. AI-led or assisted dashboard implementation.

---

## Release 9 — Scaling laboratory

This is a collection of bounded experiments, not one giant release.

Possible experiments:

- Go upload gateway;
- Redis/Celery;
- alternate queue systems;
- multiple workers;
- remote workers;
- GPU scheduling;
- MinIO;
- S3-compatible storage;
- JuiceFS;
- distributed cache;
- Kubernetes;
- cloud deployment;
- model serving and rollback;
- second workload adapter.

Every experiment must contain:

1. hypothesis;
2. setup;
3. benchmark;
4. result;
5. trade-off analysis;
6. ADR;
7. integration decision.

---

# 7. Technology decision gates

## 7.1 Go gateway

Add only when justified by:

- measured upload behavior;
- a useful trust boundary;
- independent deployment needs;
- deliberate language-learning value worth the operational cost.

Do not claim Python cannot stream uploads without evidence.

## 7.2 Celery and Redis

Add when a simple persistent worker is insufficient.

Questions:

- Do you need multiple workers?
- Do you need priorities?
- Do you need retry scheduling?
- Do you need remote execution?
- Do you need delivery guarantees?
- Is another stateful dependency justified?

## 7.3 MLflow

Add when it meaningfully simplifies:

- experiment tracking;
- artifacts;
- model registry;
- lineage;
- comparison.

Do not add it only to check an MLOps-tool box.

## 7.4 Prometheus and Grafana

Add after real metrics exist.

Do not build decorative dashboards around mocked behavior.

## 7.5 JuiceFS

Treat JuiceFS as a storage profile or scaling experiment.

Potential use cases:

- repeated dataset reads;
- multiple training workers;
- shared POSIX namespace;
- object-storage-backed datasets;
- distributed caching;
- checkpoint and artifact sharing.

Required evaluation:

- local disk baseline;
- direct object-storage baseline;
- JuiceFS cold-cache performance;
- JuiceFS warm-cache performance;
- GPU utilization;
- throughput;
- operational complexity;
- failure behavior;
- metadata dependency;
- backup and recovery.

## 7.6 Kubernetes

Add only when Compose cannot satisfy a real requirement.

Possible justifications:

- multi-node scheduling;
- worker autoscaling;
- stronger isolation;
- job orchestration;
- rolling deployment;
- multiple deployment targets.

---

# 8. Security baseline

## 8.1 File uploads

- enforce maximum request size;
- allow only required file types;
- inspect content, not only extension;
- generate server-side names;
- never trust user paths;
- store outside source directories;
- do not make uploads executable;
- calculate hashes;
- log metadata safely.

## 8.2 Archive extraction

- prevent path traversal;
- reject absolute paths;
- reject unsafe symlinks;
- enforce decompressed-size limits;
- enforce file-count limits;
- extract into isolated staging directories;
- clean up failed extractions.

## 8.3 Models and datasets

- treat model weights as untrusted;
- understand deserialization risks;
- avoid unsafe loading methods where possible;
- do not execute uploaded scripts in the initial project;
- do not expose host paths directly.

## 8.4 Containers

- run as non-root;
- use read-only filesystems where practical;
- mount only required paths;
- avoid privileged mode;
- never mount the Docker socket into application containers;
- document GPU permissions;
- separate public and internal ports.

## 8.5 Secrets

- never commit secrets;
- use environment or secret files;
- document required secrets;
- provide safe defaults;
- rotate compromised credentials.

---

# 9. Testing strategy

## 9.1 Unit tests

Use for:

- validation functions;
- state transitions;
- hashing;
- path handling;
- configuration parsing;
- adapter logic.

## 9.2 Integration tests

Use for:

- database persistence;
- model loading;
- artifact storage;
- dataset extraction;
- worker interaction.

## 9.3 End-to-end tests

Every release must have at least one.

Examples:

- upload image and receive annotated result;
- restart and reopen a historical run;
- upload dataset and receive validation report;
- launch tiny training run and register the resulting model;
- install on a clean VM and complete inference.

## 9.4 Failure tests

Required for:

- corrupt images;
- invalid weights;
- malformed labels;
- malicious ZIP paths;
- worker interruption;
- cancellation;
- missing artifacts;
- insufficient disk;
- invalid configuration.

---

# 10. Feedback-loop rules

Every release must end with:

- [ ] a working demonstration;
- [ ] one screenshot or short recording;
- [ ] one automated end-to-end test;
- [ ] one architecture decision note;
- [ ] one tagged version;
- [ ] a short retrospective.

No active release should run for more than one week without producing something visible.

If a release is too large, split it.

---

# 11. Scope-control system

## 11.1 Three scopes

### Product vision

May expand freely.

### Active release

Frozen except for defects or missing acceptance criteria.

### Experiments

Separate investigations that may influence later architecture.

## 11.2 Parking Lot format

```markdown
## Idea: JuiceFS storage profile

Why it is interesting:
- shared storage;
- distributed cache;
- repeated dataset reads.

Possible value:
- better GPU utilization;
- easier multi-worker access.

Do not implement before:
- training exists;
- storage bottleneck is measurable.

Required experiment:
- compare local, object storage, and JuiceFS.
```

## 11.3 Scope admission rule

A new feature enters the active release only when:

- it is required for an acceptance criterion;
- it fixes correctness;
- it fixes security;
- the release cannot be completed without it.

Everything else goes to the Parking Lot.

---

# 12. Architecture Decision Record template

Create one file per important decision under `docs/decisions/`.

```markdown
# ADR-XXXX: Decision title

## Status

Proposed / Accepted / Rejected / Superseded

## Context

What problem are we solving?

## Options considered

### Option A
Pros:
Cons:

### Option B
Pros:
Cons:

## Decision

What was chosen?

## Reasoning

Why?

## Consequences

What becomes easier?
What becomes harder?
What new risks exist?

## Evidence

Benchmarks, tests, documentation, or observations.

## Revisit when

What future condition should trigger reconsideration?
```

---

# 13. Work-session procedure

At the start of every session:

- [ ] Open `CURRENT_RELEASE.md`.
- [ ] Read the active goal.
- [ ] Pick one unchecked task.
- [ ] Write the expected result.
- [ ] Work on only that task.

At the end:

- [ ] Run relevant tests.
- [ ] Record what changed.
- [ ] Record blockers.
- [ ] Commit coherent work.
- [ ] Update `CURRENT_RELEASE.md`.
- [ ] Put new ideas in the Parking Lot.

---

# 14. Debugging procedure

When stuck:

1. Write what you expected.
2. Write what actually happened.
3. Capture the exact error.
4. List what you already tested.
5. Reduce the problem.
6. Check official documentation.
7. Ask AI for diagnosis or likely causes, not a complete replacement implementation.
8. Verify the explanation.
9. Implement and test the fix.
10. Record the lesson if it changes architecture or future debugging.

Suggested AI prompt:

```text
Do not write the final implementation for me.

Given the expected behavior, actual behavior, logs, and tests below:
1. identify the most likely failure mechanisms;
2. explain why each is plausible;
3. suggest the smallest experiments that distinguish them;
4. point me toward the relevant official documentation concepts.
```

---

# 15. First seven working days

This is a suggested sequence, not a rigid calendar.

## Day 1

- [ ] Create repository.
- [ ] Add `README.md`.
- [ ] Add `ROADMAP.md`.
- [ ] Add `ARCHITECTURE.md`.
- [ ] Add `AI_USE.md`.
- [ ] Add `CURRENT_RELEASE.md`.
- [ ] Define product statement and non-goals.

## Day 2

- [ ] Define dataset, run, model, and artifact.
- [ ] Write product flow.
- [ ] List required screens.
- [ ] Define mocked data.

## Day 3

- [ ] Generate UI shell using AI.
- [ ] Run it locally.
- [ ] Remove unnecessary complexity.
- [ ] Make every screen reachable.

## Day 4

- [ ] Finalize inference API contract.
- [ ] Create backend skeleton.
- [ ] Add health endpoint.
- [ ] Connect UI health indicator.

## Day 5

- [ ] Implement image validation.
- [ ] Implement YOLO model loading.
- [ ] Run inference.
- [ ] Return structured detections.

## Day 6

- [ ] Save input and annotated artifacts.
- [ ] Connect real inference UI.
- [ ] Add error states.
- [ ] Display timings.

## Day 7

- [ ] Add end-to-end test.
- [ ] Record demo.
- [ ] Write ADR for initial backend structure.
- [ ] Tag Release 1 if acceptance criteria pass.
- [ ] Write retrospective.

---

# 16. Definition of done

A release is done only when:

- acceptance criteria pass;
- tests pass;
- documentation matches behavior;
- security-sensitive behavior is reviewed;
- a clean demonstration is possible;
- the release is tagged;
- the next release has not leaked into current implementation.

“Mostly works” is not done.

“Works only on my current machine” is not done for the self-hosted release.

“AI generated it and it seems fine” is not done.

---

# 17. Parking Lot

Add ideas here without implementing them immediately.

## Architecture

- Go ingestion gateway;
- Redis;
- Celery;
- alternate queue systems;
- event bus;
- microservice split;
- API gateway;
- authentication;
- multi-user support.

## Storage

- MinIO;
- S3;
- JuiceFS;
- NFS;
- distributed cache;
- storage tiering;
- remote artifact storage.

## Compute

- multiple workers;
- remote GPU worker;
- GPU scheduler;
- Kubernetes jobs;
- autoscaling;
- cloud bursting;
- multi-GPU training.

## MLOps

- MLflow;
- DVC;
- model promotion;
- deployment rollback;
- drift monitoring;
- automated retraining;
- lineage graph;
- model evaluation gates.

## Workloads

- sklearn adapter;
- XGBoost adapter;
- generic PyTorch adapter;
- NLP adapter;
- custom-container adapter.

## Product

- authentication;
- teams;
- permissions;
- audit log;
- project workspaces;
- notifications;
- webhooks;
- API tokens.

---

# 18. Final project rule

Keep the vision ambitious.

Keep the active release small enough to finish.

Do not remove interesting ideas merely because they are large.

Do not allow interesting ideas to become current prerequisites without evidence.

Build one visible, correct capability at a time.

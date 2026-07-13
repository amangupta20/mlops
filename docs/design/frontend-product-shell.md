# Frontend Product Shell

**Status:** Implemented in Release 0

## Purpose

Provide a clickable representation of the intended MLOps workflows before the
backend exists. The frontend establishes product flow and terminology without
defining permanent backend contracts.

## Design direction

The interface follows a "calibrated daylight lab" direction inspired by
machine-vision inspection tools rather than a generic dark AI dashboard.

- Canvas: `#F4F7F6`
- Surfaces: `#FFFFFF`
- Primary text: `#17201F`
- Secondary text: `#64716F`
- Actions: `#2359C4`
- Status: `#148477`

Sora is used for headings, Public Sans for interface copy, and IBM Plex Mono
for identifiers, metrics, timestamps, and logs.

The inference viewport is the primary signature element. Other screens remain
restrained and operational.

## Structural decisions

- Next.js App Router provides stable routes.
- A shared shell handles desktop and mobile navigation.
- Browser-local state simulates training progression, run history, and model
  registration.
- Mock records remain isolated within the frontend.
- Shadcn provides primitives, while product composition and visual tokens are
  project-specific.

## Boundaries

The mock frontend does not define permanent API contracts, model lifecycle
rules, backend architecture, persistence, dataset validation, or orchestration
semantics.

Displayed fields are illustrative and may change when real backend behavior is
designed.

## Quality baseline

- Responsive from mobile to desktop.
- Keyboard-visible focus states.
- Semantic labels.
- Reduced-motion support.
- All major workflows reachable through visible navigation.
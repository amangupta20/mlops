export type RunStatus =
  | "queued"
  | "preparing"
  | "running"
  | "evaluating"
  | "completed";

export function statusForElapsed(elapsedMs: number): RunStatus {
  if (elapsedMs >= 24_000) return "completed";
  if (elapsedMs >= 20_000) return "evaluating";
  if (elapsedMs >= 8_000) return "running";
  if (elapsedMs >= 4_000) return "preparing";
  return "queued";
}

export function progressForElapsed(elapsedMs: number) {
  return Math.min(100, Math.max(2, Math.round((elapsedMs / 24_000) * 100)));
}

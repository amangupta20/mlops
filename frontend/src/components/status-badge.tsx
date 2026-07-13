import { CircleCheck, CircleDashed, CircleX, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const POSITIVE = new Set([
  "ready",
  "valid",
  "completed",
  "online",
  "approved",
]);
const ACTIVE = new Set([
  "queued",
  "preparing",
  "running",
  "evaluating",
  "validating",
  "candidate",
]);
const NEGATIVE = new Set(["failed", "offline", "invalid"]);

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const Icon = POSITIVE.has(normalized)
    ? CircleCheck
    : NEGATIVE.has(normalized)
      ? CircleX
      : ACTIVE.has(normalized)
        ? Clock3
        : CircleDashed;

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        POSITIVE.has(normalized) &&
          "border-sensor/20 bg-sensor-soft text-sensor",
        ACTIVE.has(normalized) &&
          "border-primary/15 bg-accent text-accent-foreground",
        NEGATIVE.has(normalized) &&
          "border-destructive/20 bg-destructive/10 text-destructive",
        className,
      )}
    >
      <Icon data-icon="inline-start" />
      {status}
    </Badge>
  );
}

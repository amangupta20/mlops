import { Timer } from "lucide-react";

import { MOCK_DETECTIONS } from "@/lib/mock-data";

const timing = [
  ["Preprocess", "3.2 ms"],
  ["Inference", "21.8 ms"],
  ["Postprocess", "3.6 ms"],
] as const;

export function DetectionRail({ confidence }: { confidence: number }) {
  const detections = MOCK_DETECTIONS.filter(
    (detection) => detection.confidence * 100 >= confidence,
  );

  return (
    <aside className="flex min-h-0 flex-col border-t bg-card lg:border-t-0 lg:border-l">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="font-heading text-sm font-semibold">Objects</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {detections.length} {detections.length === 1 ? "detection" : "detections"}
          </p>
        </div>
        <span className="font-data text-[0.62rem] text-muted-foreground">
          conf ≥ {(confidence / 100).toFixed(2)}
        </span>
      </div>

      <div className="divide-y">
        {detections.map((detection) => (
          <div
            key={detection.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="size-2 rounded-sm"
                style={{ backgroundColor: detection.color }}
              />
              <span className="truncate text-sm font-medium">
                {detection.label}
              </span>
            </div>
            <span className="font-data text-xs font-semibold">
              {Math.round(detection.confidence * 100)}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t bg-muted/45 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium">
          <Timer className="size-3.5 text-primary" aria-hidden="true" />
          Mock timing
        </div>
        <dl className="grid gap-2">
          {timing.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="font-data text-xs">{value}</dd>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between gap-4 border-t pt-2">
            <dt className="text-xs font-medium">Total</dt>
            <dd className="font-data text-xs font-semibold text-primary">
              28.6 ms
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

import { ScanSearch, Timer } from "lucide-react";

export type Detection = {
  class_id: number;
  label: string;
  confidence: number;
  box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};

type DetectionRailProps = {
  detections: Detection[];
  processingTime: string;
  modelUsed: string;
};

export function DetectionRail({
  detections,
  processingTime,
  modelUsed,
}: DetectionRailProps) {
  return (
    <aside className="flex min-h-0 flex-col border-t bg-card lg:border-t-0 lg:border-l">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="font-heading text-sm font-semibold">Objects</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {detections.length} {detections.length === 1 ? "detection" : "detections"}
          </p>
        </div>
      </div>

      {detections.length > 0 ? (
        <div className="min-h-0 flex-1 divide-y overflow-y-auto">
          {detections.map((detection, index) => (
            <div
              key={`${detection.class_id}-${detection.box.x1}-${detection.box.y1}-${index}`}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <ScanSearch
                  className="size-3.5 shrink-0 text-primary"
                  aria-hidden="true"
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
      ) : (
        <div className="grid flex-1 place-items-center px-6 text-center text-xs leading-5 text-muted-foreground">
          No objects met the confidence threshold.
        </div>
      )}

      <div className="mt-auto border-t bg-muted/45 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium">
          <Timer className="size-3.5 text-primary" aria-hidden="true" />
          Response metadata
        </div>
        <dl className="grid gap-2">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-xs text-muted-foreground">Model used</dt>
            <dd className="font-data text-xs font-semibold">{modelUsed}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-xs text-muted-foreground">Processing time</dt>
            <dd className="font-data text-xs font-semibold text-primary">
              {processingTime}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

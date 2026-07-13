import { AlertTriangle, Check } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_VALIDATION_REPORT } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ValidationSummary() {
  const report = MOCK_VALIDATION_REPORT;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-5">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-semibold">
                  Validation summary
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Simulated structural and content checks.
                </p>
              </div>
              <StatusBadge status="valid" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 pt-1 sm:grid-cols-4">
            {[
              ["Passed", report.summary.passed, "text-sensor"],
              ["Warnings", report.summary.warnings, "text-warning"],
              ["Failed", report.summary.failed, "text-foreground"],
              ["Duration", report.summary.duration, "text-foreground"],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={cn("font-data mt-2 text-lg font-semibold", color)}>
                  {value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <h2 className="font-heading text-lg font-semibold">Checks</h2>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {report.checks.map((check) => {
              const warning = check.status === "warning";
              const Icon = warning ? AlertTriangle : Check;
              return (
                <div
                  key={check.name}
                  className="flex items-start gap-3 px-4 py-4"
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                      warning
                        ? "bg-warning-soft text-warning"
                        : "bg-sensor-soft text-sensor",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{check.name}</p>
                    <p className="font-data mt-1 text-[0.66rem] text-muted-foreground">
                      {check.detail}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium capitalize",
                      warning ? "text-warning" : "text-sensor",
                    )}
                  >
                    {check.status}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <h2 className="font-heading font-semibold">Dataset facts</h2>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              {[
                ["Images", report.dataset.images.toLocaleString()],
                ["Labels", report.dataset.labels.toLocaleString()],
                ["Classes", report.dataset.classes],
                ["Size", report.dataset.size],
                ["Version", report.dataset.version],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-data text-xs font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-heading font-semibold">Class distribution</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.classes.map((item) => (
              <div key={item.name}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-data text-muted-foreground">
                    {item.count.toLocaleString()} · {item.percent}%
                  </span>
                </div>
                <Progress
                  value={item.percent}
                  aria-label={`${item.name}: ${item.percent}%`}
                  className="h-1.5"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="rounded-xl border border-warning/20 bg-warning-soft p-4">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="size-4" aria-hidden="true" />
            <p className="font-heading text-sm font-semibold">2 warnings</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#6c4a1b]">
            Unlabeled and duplicate images are visible for review but do not block this mock dataset.
          </p>
        </div>
      </div>
    </div>
  );
}

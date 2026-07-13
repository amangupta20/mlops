"use client";

import { Check, Clock3, ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { RunStatus } from "@/lib/mock-run";
import { useMockState } from "@/providers/mock-state-provider";

const stages: RunStatus[] = [
  "queued",
  "preparing",
  "running",
  "evaluating",
  "completed",
];

const logByStatus: Record<RunStatus, string[]> = {
  queued: ["run accepted by mock scheduler", "waiting for GPU 0"],
  preparing: ["resolving dataset fixture", "loading yolo11n weights"],
  running: ["epoch 18/40  box_loss=0.071", "validating intermediate metrics"],
  evaluating: ["training loop complete", "evaluating best checkpoint"],
  completed: ["evaluation complete  mAP50=0.857", "candidate model registered"],
};

export function ActiveRun() {
  const { activeRun, resetDemo } = useMockState();

  if (!activeRun) {
    return (
      <Card className="border-dashed py-16 text-center">
        <CardContent>
          <Clock3 className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <h2 className="font-heading mt-4 font-semibold">No active mock run</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start from a training configuration to see state progression.
          </p>
          <Button asChild className="mt-5">
            <Link href="/training">Configure training</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentStage = stages.indexOf(activeRun.status as RunStatus);
  const completed = activeRun.status === "completed";
  const elapsedSeconds = Math.min(
    24,
    Math.round((activeRun.progress / 100) * 24),
  );
  const elapsedLabel = `00:${String(elapsedSeconds).padStart(2, "0")} elapsed`;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-5">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-data text-[0.64rem] tracking-[0.12em] text-muted-foreground uppercase">
                  {activeRun.id}
                </p>
                <CardTitle className="mt-1 text-lg">{activeRun.name}</CardTitle>
              </div>
              <StatusBadge status={activeRun.status} />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Overall progress</p>
                <p className="font-data mt-1 text-2xl font-semibold">{activeRun.progress}%</p>
              </div>
              <p className="font-data text-xs text-muted-foreground">
                {elapsedLabel}
              </p>
            </div>
            <Progress
              value={activeRun.progress}
              aria-label={`Overall progress: ${activeRun.progress}%`}
              className="h-2"
            />

            <ol className="mt-7 grid gap-3 sm:grid-cols-5">
              {stages.map((stage, index) => {
                const done = index < currentStage || completed;
                const current = index === currentStage && !completed;
                return (
                  <li key={stage} className="relative">
                    <div className="flex items-center gap-2 sm:block">
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full border text-[0.62rem]",
                          done && "border-sensor bg-sensor text-white",
                          current && "border-primary bg-primary text-white",
                          !done && !current && "bg-background text-muted-foreground",
                        )}
                      >
                        {done ? <Check className="size-3" aria-hidden="true" /> : index + 1}
                      </span>
                      <p className={cn("mt-0 text-xs capitalize sm:mt-2", current && "font-semibold text-primary")}>
                        {stage}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Live metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 pt-1 sm:grid-cols-5">
            {[
              ["mAP50", activeRun.metrics.map50.toFixed(3)],
              ["mAP50–95", activeRun.metrics.map5095.toFixed(3)],
              ["Precision", activeRun.metrics.precision.toFixed(3)],
              ["Recall", activeRun.metrics.recall.toFixed(3)],
              ["Box loss", activeRun.metrics.boxLoss.toFixed(3)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border bg-background p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-data mt-2 text-base font-semibold">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#17201f] text-white ring-0">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-white">Run log</CardTitle>
              <span className="font-data text-[0.6rem] tracking-[0.12em] text-white/45 uppercase">Simulated</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-1 font-data text-xs text-white/72">
            {logByStatus[activeRun.status as RunStatus].map((line, index) => (
              <p key={line}>
                <span className="mr-3 text-[#65d6c9]">10:00:{String(index + 14).padStart(2, "0")}</span>
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              {Object.entries(activeRun.config).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b pb-3 last:border-0">
                  <dt className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="font-data text-right text-xs">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {completed ? (
          <Card className="border-sensor/20 bg-sensor-soft/70">
            <CardHeader>
              <CardTitle>Candidate registered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/models">
                  Open model registry
                  <ExternalLink data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-card">
                <Link href={`/runs/details?run=${activeRun.id}`}>View run details</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Button variant="ghost" className="w-full text-muted-foreground" onClick={resetDemo}>
          <RotateCcw data-icon="inline-start" />
          Reset demo state
        </Button>
      </div>
    </div>
  );
}

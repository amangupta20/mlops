"use client";

import { Download, FileText, ImageIcon, Weight } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockState } from "@/providers/mock-state-provider";

export function RunDetails({ runId }: { runId?: string }) {
  const { activeRun, runs } = useMockState();
  const run = runs.find((candidate) => candidate.id === runId) ?? activeRun ?? runs[0];

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-1">
          <div>
            <p className="font-data text-[0.65rem] text-muted-foreground">{run.id}</p>
            <p className="mt-1 font-medium">{run.name}</p>
          </div>
          <StatusBadge status={run.status} />
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm">
                {Object.entries(run.config).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 border-b pb-3 last:border-0">
                    <dt className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="font-data text-right text-xs">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Final metrics</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {Object.entries(run.metrics).map(([key, value]) => (
                <div key={key} className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">{key}</p>
                  <p className="font-data mt-2 text-base font-semibold">{value.toFixed(3)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="artifacts" className="mt-5">
          <Card>
            <CardHeader><CardTitle>Artifacts</CardTitle></CardHeader>
            <CardContent className="divide-y">
              {[
                [Weight, "best.pt", "Model weights · 5.8 MB"],
                [FileText, "results.csv", "Metric history · 18 KB"],
                [ImageIcon, "confusion_matrix.png", "Evaluation image · 248 KB"],
              ].map(([Icon, name, detail]) => {
                const ArtifactIcon = Icon as typeof Weight;
                return (
                  <div key={name as string} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <ArtifactIcon className="size-4 text-primary" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="font-data truncate text-xs font-medium">{name as string}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{detail as string}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" disabled aria-label={`Download ${name as string}`}>
                      <Download aria-hidden="true" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logs" className="mt-5">
          <Card className="bg-[#17201f] text-white ring-0">
            <CardContent className="space-y-2 py-2 font-data text-xs text-white/70">
              <p><span className="mr-3 text-[#65d6c9]">15:39:42</span>evaluation complete</p>
              <p><span className="mr-3 text-[#65d6c9]">15:40:03</span>best checkpoint saved</p>
              <p><span className="mr-3 text-[#65d6c9]">15:40:18</span>run reached terminal state</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

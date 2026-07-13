import type { Metadata } from "next";
import { Cpu, Database, HardDrive, Server, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_SERVICES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "System status" };

const icons = [Server, Cpu, HardDrive, Database];

export default function SystemPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Workspace health"
        title="System status"
        description="Preview how service posture and capacity will be presented once real health signals exist."
        action={<Badge variant="outline">Simulated status</Badge>}
      />

      <section className="mt-8" aria-labelledby="services-heading">
        <div className="mb-4">
          <h2 id="services-heading" className="font-heading font-semibold">Services</h2>
          <p className="mt-1 text-sm text-muted-foreground">Illustrative service state, not live telemetry.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MOCK_SERVICES.map((service, index) => {
            const Icon = icons[index];
            return (
              <Card key={service.name}>
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="grid size-9 place-items-center rounded-lg border bg-background text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <StatusBadge status={service.status} />
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-3">
                  <p className="text-xs text-muted-foreground">{service.detail}</p>
                  <p className="font-data text-xs font-semibold">{service.latency}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]" aria-label="Mock capacity">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Compute</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 pt-1 sm:grid-cols-3">
            <Utilization label="GPU utilization" value={12} detail="1 device · 2.1 / 12 GB" />
            <Utilization label="CPU utilization" value={28} detail="8 logical cores" />
            <Utilization label="Memory" value={44} detail="7.1 / 16 GB" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Storage</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <Utilization label="Local workspace" value={37} detail="18.4 / 50 GB" />
            <dl className="mt-5 grid gap-3 text-xs">
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Datasets</dt><dd className="font-data">8.1 GB</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Models</dt><dd className="font-data">31.2 MB</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Artifacts</dt><dd className="font-data">10.3 GB</dd></div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <div className="mt-5 flex gap-3 rounded-xl border border-warning/20 bg-warning-soft p-4 text-warning">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">No health endpoints are connected</p>
          <p className="mt-1 text-xs leading-5 text-[#6c4a1b]">
            Every service and capacity value on this screen is a Release 0 fixture.
          </p>
        </div>
      </div>
    </div>
  );
}

function Utilization({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium">{label}</p>
          <p className="font-data mt-1 text-[0.62rem] text-muted-foreground">{detail}</p>
        </div>
        <span className="font-data text-sm font-semibold">{value}%</span>
      </div>
      <Progress
        value={value}
        aria-label={`${label}: ${value}%`}
        className="h-2"
      />
    </div>
  );
}

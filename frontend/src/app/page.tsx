import {
  Activity,
  Boxes,
  Database,
  History,
  ScanSearch,
  SlidersHorizontal,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { WorkflowCard } from "@/components/workflow-card";

const workflows = [
  {
    title: "Inference",
    description: "Inspect an image with a selected vision model.",
    factLabel: "Last result",
    factValue: "3 detections",
    href: "/inference",
    action: "Run inference",
    icon: ScanSearch,
  },
  {
    title: "Datasets",
    description: "Review dataset inventory and validation evidence.",
    factLabel: "Validated",
    factValue: "2 of 3",
    href: "/datasets",
    action: "Browse datasets",
    icon: Database,
  },
  {
    title: "Training",
    description: "Configure and start an illustrative training run.",
    factLabel: "Available device",
    factValue: "1 × GPU",
    href: "/training",
    action: "Configure training",
    icon: SlidersHorizontal,
  },
  {
    title: "Runs",
    description: "Trace run state, metrics, logs, and artifacts.",
    factLabel: "Recent runs",
    factValue: "3 total",
    href: "/runs",
    action: "Open run history",
    icon: History,
  },
  {
    title: "Models",
    description: "Inspect registered weights and their source runs.",
    factLabel: "Candidates",
    factValue: "1 model",
    href: "/models",
    action: "View registry",
    icon: Boxes,
  },
  {
    title: "System status",
    description: "See the simulated workspace service posture.",
    factLabel: "Services",
    factValue: "4 online",
    href: "/system",
    action: "Inspect system",
    icon: Activity,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Operations overview"
        title="One workspace, six visible workflows."
        description="Explore the intended product before the technical core exists. Every value and status in this release is simulated."
        action={<StatusBadge status="ready" className="h-7 px-3" />}
      />

      <section className="mt-8" aria-labelledby="workflow-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="workflow-heading" className="font-heading font-semibold">
              Workspace
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each workflow is independently reachable.
            </p>
          </div>
          <span className="font-data text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
            Browser-local state
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.title} {...workflow} />
          ))}
        </div>
      </section>
    </div>
  );
}

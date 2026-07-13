import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ActiveRun } from "@/components/training/active-run";

export const metadata: Metadata = { title: "Active training run" };

export default function ActiveTrainingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Training workflow"
        title="Active run"
        description="Watch the browser-local run move through its intended states and register a candidate model on completion."
      />
      <div className="mt-8"><ActiveRun /></div>
    </div>
  );
}

import type { Metadata } from "next";

import { InferenceWorkspace } from "@/components/inference/inference-workspace";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "Inference",
};

export default function InferencePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Vision workspace"
        title="Inspect an image."
        description="Preview the first product workflow with a local file and a fully simulated detection result. Nothing leaves this browser."
        action={<StatusBadge status="ready" className="h-7 px-3" />}
      />
      <div className="mt-8">
        <InferenceWorkspace />
      </div>
    </div>
  );
}

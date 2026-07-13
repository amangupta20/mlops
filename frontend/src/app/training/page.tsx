import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { TrainingForm } from "@/components/training/training-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Training configuration" };

export default function TrainingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Training workflow"
        title="Configure training"
        description="Set presentation-only values, then start an accelerated mock run that remains visible across the workspace."
        action={<Badge variant="outline">Mock configuration</Badge>}
      />
      <div className="mt-8"><TrainingForm /></div>
    </div>
  );
}

import type { Metadata } from "next";

import { ModelTable } from "@/components/models/model-table";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Model registry" };

export default function ModelsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Model assets"
        title="Model registry"
        description="Inspect seeded model fixtures and the candidate produced by a completed mock training run."
      />
      <section className="mt-8" aria-label="Registered models"><ModelTable /></section>
    </div>
  );
}

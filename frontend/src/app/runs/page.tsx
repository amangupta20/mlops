import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { RunTable } from "@/components/runs/run-table";

export const metadata: Metadata = { title: "Run history" };

export default function RunsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Run records"
        title="Run history"
        description="Trace seeded examples alongside the current browser-local training run."
      />
      <section className="mt-8" aria-label="Run history"><RunTable /></section>
    </div>
  );
}

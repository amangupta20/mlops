import type { Metadata } from "next";

import { DatasetTable } from "@/components/datasets/dataset-table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Datasets",
};

export default function DatasetsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Data inventory"
        title="Datasets"
        description="Inspect the mocked data assets available to validation and training workflows. No files are stored in this release."
        action={<Badge variant="outline">3 mock datasets</Badge>}
      />
      <section className="mt-8" aria-label="Dataset inventory">
        <DatasetTable />
      </section>
    </div>
  );
}

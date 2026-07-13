import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ValidationSummary } from "@/components/datasets/validation-summary";

export const metadata: Metadata = {
  title: "Dataset validation",
};

export default function ValidationPage() {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2">
        <Link href="/datasets">
          <ArrowLeft data-icon="inline-start" />
          Back to datasets
        </Link>
      </Button>
      <PageHeader
        eyebrow="Urban traffic · v3"
        title="Dataset validation"
        description="A seeded report showing how validation evidence will be organized once dataset ingestion exists."
      />
      <div className="mt-8">
        <ValidationSummary />
      </div>
    </div>
  );
}

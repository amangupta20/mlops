import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { RunDetails } from "@/components/runs/run-details";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Run details" };

export default async function RunDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ run?: string }>;
}) {
  const { run } = await searchParams;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-5 -ml-2">
        <Link href="/runs"><ArrowLeft data-icon="inline-start" />Back to runs</Link>
      </Button>
      <PageHeader
        eyebrow="Run evidence"
        title="Run details"
        description="Inspect illustrative configuration, metrics, artifacts, and logs in one traceable record."
      />
      <div className="mt-8"><RunDetails runId={run} /></div>
    </div>
  );
}

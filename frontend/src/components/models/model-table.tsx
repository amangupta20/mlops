"use client";

import { Box, ExternalLink } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMockState } from "@/providers/mock-state-provider";

export function ModelTable() {
  const { models } = useMockState();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {models.map((model) => (
        <Card key={model.id}>
          <CardHeader>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="grid size-9 place-items-center rounded-lg border bg-background text-primary">
                <Box className="size-4" aria-hidden="true" />
              </span>
              <StatusBadge status={model.state} />
            </div>
            <CardTitle className="truncate text-base">{model.name}</CardTitle>
            <p className="font-data text-[0.65rem] text-muted-foreground">
              {model.version} · {model.id}
            </p>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Base model</dt>
                <dd className="font-data mt-1">{model.baseModel}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">mAP50</dt>
                <dd className="font-data mt-1">{model.map50 ? model.map50.toFixed(3) : "baseline"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Artifact</dt>
                <dd className="font-data mt-1">{model.size}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Source run</dt>
                <dd className="font-data mt-1 truncate">{model.sourceRun}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="p-0">
            {model.sourceRun === "built-in" ? (
              <div className="flex h-10 w-full items-center px-4 text-xs text-muted-foreground">
                Built-in model · no source run
              </div>
            ) : (
              <Button asChild variant="ghost" className="h-10 w-full justify-between rounded-t-none">
                <Link href={`/runs/details?run=${model.sourceRun}`}>
                  Inspect lineage
                  <ExternalLink data-icon="inline-end" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

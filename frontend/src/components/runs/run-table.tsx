"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMockState } from "@/providers/mock-state-provider";

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(timestamp);
}

export function RunTable() {
  const { runs } = useMockState();

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/45 hover:bg-muted/45">
            <TableHead>Run</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead className="text-right">mAP50</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>
                <p className="max-w-56 truncate font-medium">{run.name}</p>
                <p className="font-data mt-0.5 text-[0.65rem] text-muted-foreground">{run.id}</p>
              </TableCell>
              <TableCell className="capitalize">{run.type}</TableCell>
              <TableCell><StatusBadge status={run.status} /></TableCell>
              <TableCell className="font-data text-xs">{formatDate(run.startedAt)}</TableCell>
              <TableCell className="font-data text-right text-xs">
                {run.metrics.map50 ? run.metrics.map50.toFixed(3) : "—"}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/runs/details?run=${run.id}`} aria-label={`View ${run.id}`}>
                    View <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

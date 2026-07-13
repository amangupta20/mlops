import { ArrowRight, Database } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_DATASETS } from "@/lib/mock-data";

export function DatasetTable() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/45 hover:bg-muted/45">
              <TableHead>Dataset</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Images</TableHead>
              <TableHead className="text-right">Labels</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="w-36" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_DATASETS.map((dataset) => (
              <TableRow key={dataset.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg border bg-background text-primary">
                      <Database className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium">{dataset.name}</p>
                      <p className="font-data mt-0.5 text-[0.65rem] text-muted-foreground">
                        {dataset.version} · {dataset.classes} classes
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={dataset.status} />
                </TableCell>
                <TableCell className="font-data text-right text-xs">
                  {dataset.images.toLocaleString()}
                </TableCell>
                <TableCell className="font-data text-right text-xs">
                  {dataset.labels.toLocaleString()}
                </TableCell>
                <TableCell className="font-data text-right text-xs">
                  {dataset.size}
                </TableCell>
                <TableCell className="text-right">
                  {dataset.id === "dataset-traffic-v3" ? (
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/datasets/validation">
                        View validation
                        <ArrowRight data-icon="inline-end" />
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {dataset.status === "valid" ? "Validated" : "In progress"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {MOCK_DATASETS.map((dataset) => (
          <Card key={dataset.id}>
            <CardHeader className="grid-cols-[1fr_auto]">
              <div>
                <CardTitle>{dataset.name}</CardTitle>
                <p className="font-data mt-1 text-[0.65rem] text-muted-foreground">
                  {dataset.version} · {dataset.size}
                </p>
              </div>
              <StatusBadge status={dataset.status} />
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Images</dt>
                  <dd className="font-data mt-1">{dataset.images.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Labels</dt>
                  <dd className="font-data mt-1">{dataset.labels.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Classes</dt>
                  <dd className="font-data mt-1">{dataset.classes}</dd>
                </div>
              </dl>
              {dataset.id === "dataset-traffic-v3" ? (
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/datasets/validation">View validation</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

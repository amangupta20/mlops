import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WorkflowCardProps = {
  title: string;
  description: string;
  factLabel: string;
  factValue: string;
  href: string;
  action: string;
  icon: LucideIcon;
};

export function WorkflowCard({
  title,
  description,
  factLabel,
  factValue,
  href,
  action,
  icon: Icon,
}: WorkflowCardProps) {
  return (
    <Card className="min-h-56 bg-card shadow-[0_18px_50px_-40px_rgb(23_32_31/0.65)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-32px_rgb(23_32_31/0.35)]">
      <CardHeader>
        <div className="mb-3 flex size-9 items-center justify-center rounded-lg border bg-background text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="max-w-xs leading-5">
          {description}
        </CardDescription>
        <CardAction>
          <span className="font-data text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
            Mock
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto flex items-baseline justify-between gap-4">
        <span className="text-xs text-muted-foreground">{factLabel}</span>
        <span className="font-data text-right text-xs font-medium">
          {factValue}
        </span>
      </CardContent>
      <CardFooter className="bg-muted/55 p-0">
        <Link
          href={href}
          className="flex w-full items-center justify-between px-4 py-3 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {action}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}

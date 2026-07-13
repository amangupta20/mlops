"use client";

import type { ReactNode } from "react";
import { Menu, ScanLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link
      href="/"
      aria-label="FOSS YOLO home"
      className="flex items-center gap-3 rounded-md"
    >
      <span className="relative grid size-9 place-items-center rounded-lg bg-foreground text-background shadow-sm">
        <ScanLine className="size-4" aria-hidden="true" />
        <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full border-2 border-sidebar bg-sensor" />
      </span>
      <span>
        <span className="font-heading block text-sm font-semibold tracking-[-0.025em]">
          FOSS YOLO
        </span>
        <span className="font-data block text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
          MLOps workspace
        </span>
      </span>
    </Link>
  );
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Product navigation" className="grid gap-1">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        const link = (
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active &&
                "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_var(--primary),0_1px_2px_rgb(23_32_31/0.05)]",
            )}
          >
            <item.icon
              className={cn(
                "size-[1.05rem] transition-colors group-hover:text-primary",
                active && "text-primary",
              )}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );

        return mobile ? (
          <SheetClose asChild key={item.href}>
            {link}
          </SheetClose>
        ) : (
          <div key={item.href}>{link}</div>
        );
      })}
    </nav>
  );
}

function ReadyIndicator() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-sensor opacity-30" />
        <span className="relative inline-flex size-2 rounded-full bg-sensor" />
      </span>
      <span>Simulated ready</span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[15.5rem] flex-col border-r bg-sidebar px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-10">
          <p className="font-data mb-3 px-3 text-[0.6rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Workflows
          </p>
          <Navigation />
        </div>
        <div className="mt-auto rounded-xl border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <ReadyIndicator />
            <span className="font-data text-[0.58rem] text-muted-foreground">
              R0
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Product shell using browser-local mock data.
          </p>
        </div>
      </aside>

      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/92 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="font-data text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
              Local workspace
            </span>
            <span className="text-border">/</span>
            <ReadyIndicator />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-data hidden text-[0.62rem] text-muted-foreground sm:inline">
              Release 0 · mock UI
            </span>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[19rem] bg-sidebar">
                <SheetHeader className="border-b px-5 py-5 text-left">
                  <SheetTitle>
                    <Brand />
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Product navigation
                  </SheetDescription>
                </SheetHeader>
                <div className="px-3 py-2">
                  <Navigation mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto w-full max-w-[96rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

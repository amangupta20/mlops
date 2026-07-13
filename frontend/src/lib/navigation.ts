import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Boxes,
  Database,
  Gauge,
  History,
  ScanSearch,
  SlidersHorizontal,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Gauge },
  { label: "Inference", href: "/inference", icon: ScanSearch },
  { label: "Datasets", href: "/datasets", icon: Database },
  { label: "Training", href: "/training", icon: SlidersHorizontal },
  { label: "Runs", href: "/runs", icon: History },
  { label: "Models", href: "/models", icon: Boxes },
  { label: "System status", href: "/system", icon: Activity },
];

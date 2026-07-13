import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/app-shell";

const { getPathname } = vi.hoisted(() => ({
  getPathname: vi.fn(() => "/"),
}));

vi.mock("next/navigation", () => ({
  usePathname: getPathname,
}));

describe("AppShell", () => {
  it("makes every Release 0 workflow reachable", () => {
    getPathname.mockReturnValue("/");
    render(
      <AppShell>
        <p>Workspace content</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Inference" })).toHaveAttribute(
      "href",
      "/inference",
    );
    expect(screen.getByRole("link", { name: "Datasets" })).toHaveAttribute(
      "href",
      "/datasets",
    );
    expect(screen.getByRole("link", { name: "Training" })).toHaveAttribute(
      "href",
      "/training",
    );
    expect(screen.getByRole("link", { name: "Runs" })).toHaveAttribute(
      "href",
      "/runs",
    );
    expect(screen.getByRole("link", { name: "Models" })).toHaveAttribute(
      "href",
      "/models",
    );
    expect(
      screen.getByRole("link", { name: "System status" }),
    ).toHaveAttribute("href", "/system");
    expect(screen.getAllByText("Simulated ready")).toHaveLength(2);
    expect(screen.getByText("Workspace content")).toBeInTheDocument();
  });

  it("marks only training active on the active-run route", () => {
    getPathname.mockReturnValue("/training/active");
    render(<AppShell>Active run content</AppShell>);

    expect(screen.getByRole("link", { name: "Training" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Runs" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});

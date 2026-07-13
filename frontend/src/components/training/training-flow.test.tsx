import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ModelTable } from "@/components/models/model-table";
import { ActiveRun } from "@/components/training/active-run";
import { TrainingForm } from "@/components/training/training-form";
import { MockStateProvider } from "@/providers/mock-state-provider";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("mock training flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-13T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    push.mockClear();
  });

  it("progresses a submitted run and registers its candidate model", () => {
    render(
      <MockStateProvider>
        <TrainingForm />
        <ActiveRun />
        <ModelTable />
      </MockStateProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start training" }));

    expect(push).toHaveBeenCalledWith("/training/active");
    expect(screen.getByText("queued", { selector: "span" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View active run" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Overall progress: 2%" }),
    ).toHaveAttribute("aria-valuenow", "2");
    expect(screen.getByText("00:00 elapsed")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(24_000);
    });

    expect(screen.getByText("completed", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("traffic-v3-detector")).toBeInTheDocument();
    expect(screen.getAllByText("candidate").length).toBeGreaterThan(0);
  });
});

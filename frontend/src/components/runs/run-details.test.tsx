import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RunDetails } from "@/components/runs/run-details";
import { MockStateProvider } from "@/providers/mock-state-provider";

describe("RunDetails", () => {
  it("shows the run requested by its detail link", () => {
    render(
      <MockStateProvider>
        <RunDetails runId="train-2042" />
      </MockStateProvider>,
    );

    expect(screen.getByText("train-2042")).toBeInTheDocument();
    expect(screen.getByText("warehouse-safety / yolo11s")).toBeInTheDocument();
  });
});

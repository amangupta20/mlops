import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SystemPage from "@/app/system/page";

describe("system status screen", () => {
  it("labels all service health as simulated", () => {
    render(<SystemPage />);

    expect(screen.getByRole("heading", { name: "System status" })).toBeInTheDocument();
    expect(screen.getByText("Simulated status")).toBeInTheDocument();
    expect(screen.getByText("Training worker")).toBeInTheDocument();
    expect(screen.getByText("Artifact storage")).toBeInTheDocument();
    expect(screen.getByText("GPU utilization")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "GPU utilization: 12%" }),
    ).toHaveAttribute("aria-valuenow", "12");
  });
});

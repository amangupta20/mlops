import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DetectionRail } from "@/components/inference/detection-rail";

describe("DetectionRail", () => {
  it("shows the confidence threshold used for the mock run", () => {
    render(<DetectionRail confidence={55} />);

    expect(screen.getByText("conf ≥ 0.55")).toBeInTheDocument();
  });

  it("hides detections below the selected threshold", () => {
    render(<DetectionRail confidence={90} />);

    expect(screen.getByText("1 detection")).toBeInTheDocument();
    expect(screen.getByText("person")).toBeInTheDocument();
    expect(screen.queryByText("car")).not.toBeInTheDocument();
    expect(screen.queryByText("backpack")).not.toBeInTheDocument();
  });
});

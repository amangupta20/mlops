import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DetectionRail } from "@/components/inference/detection-rail";

describe("DetectionRail", () => {
  it("shows serialized detections and response metadata", () => {
    render(
      <DetectionRail
        detections={[
          {
            class_id: 0,
            label: "person",
            confidence: 0.9432,
            box: { x1: 0.1, y1: 0.2, x2: 0.4, y2: 0.8 },
          },
        ]}
        processingTime="28.6 ms"
        modelUsed="yolo26s"
      />,
    );

    expect(screen.getByText("1 detection")).toBeInTheDocument();
    expect(screen.getByText("person")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("28.6 ms")).toBeInTheDocument();
    expect(screen.getByText("yolo26s")).toBeInTheDocument();
  });

  it("shows an empty state when no objects meet the threshold", () => {
    render(
      <DetectionRail
        detections={[]}
        processingTime="12.1 ms"
        modelUsed="yolo26n"
      />,
    );

    expect(screen.getByText("0 detections")).toBeInTheDocument();
    expect(
      screen.getByText("No objects met the confidence threshold."),
    ).toBeInTheDocument();
  });
});

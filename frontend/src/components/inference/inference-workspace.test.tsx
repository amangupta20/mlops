import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InferenceWorkspace } from "@/components/inference/inference-workspace";

describe("InferenceWorkspace", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const NativeURL = globalThis.URL;
    class MockURL extends NativeURL {}
    MockURL.createObjectURL = vi.fn(() => "blob:preview");
    MockURL.revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", MockURL);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("turns an image selection into a mocked inspection result", () => {
    render(<InferenceWorkspace />);

    const runButton = screen.getByRole("button", { name: "Run inference" });
    expect(runButton).toBeDisabled();

    const initialFileInput = screen.getByLabelText("Choose image");
    fireEvent.change(initialFileInput, {
      target: {
        files: [new File(["pixels"], "street.png", { type: "image/png" })],
      },
    });
    expect(runButton).toBeEnabled();

    fireEvent.click(runButton);
    expect(screen.getByText("Processing image")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1_200);
    });

    expect(screen.getByText("3 detections")).toBeInTheDocument();
    expect(screen.getAllByText("person")).toHaveLength(2);
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("28.6 ms")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear image" }));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
    expect(screen.getByLabelText("Choose image")).not.toBe(initialFileInput);
    expect(runButton).toBeDisabled();
  });

  it("explains which image formats are accepted", () => {
    render(<InferenceWorkspace />);

    fireEvent.change(screen.getByLabelText("Choose image"), {
      target: {
        files: [new File(["notes"], "notes.txt", { type: "text/plain" })],
      },
    });

    expect(
      screen.getByText("Choose a JPEG, PNG, or WebP image."),
    ).toBeInTheDocument();
  });
});

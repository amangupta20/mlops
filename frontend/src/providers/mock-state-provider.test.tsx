import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { statusForElapsed } from "@/lib/mock-run";
import {
  MockStateProvider,
  useMockState,
} from "@/providers/mock-state-provider";

function Probe() {
  const { activeRun, models, runs, startTraining } = useMockState();

  return (
    <div>
      <button
        onClick={() =>
          startTraining({
            datasetId: "dataset-traffic-v3",
            baseModel: "yolo11n",
            epochs: 40,
            batchSize: 16,
            imageSize: 640,
            device: "GPU 0",
          })
        }
      >
        Start
      </button>
      <span>status:{activeRun?.status ?? "idle"}</span>
      <span>models:{models.length}</span>
      <span>runs:{runs.length}</span>
      <span>created:{models.filter((model) => model.sourceRun === activeRun?.id).length}</span>
    </div>
  );
}

describe("mock run progression", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-13T09:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("maps elapsed time to the accelerated run states", () => {
    expect(statusForElapsed(0)).toBe("queued");
    expect(statusForElapsed(4_000)).toBe("preparing");
    expect(statusForElapsed(8_000)).toBe("running");
    expect(statusForElapsed(20_000)).toBe("evaluating");
    expect(statusForElapsed(24_000)).toBe("completed");
  });

  it("registers one candidate model when the active run completes", () => {
    render(
      <MockStateProvider>
        <Probe />
      </MockStateProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.getByText("status:queued")).toBeInTheDocument();
    expect(screen.getByText("runs:4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.getByText("runs:4")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(24_000);
    });

    expect(screen.getByText("status:completed")).toBeInTheDocument();
    expect(screen.getByText("created:1")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    expect(screen.getByText("created:1")).toBeInTheDocument();
  });

  it("restores a browser-local run after the provider remounts", () => {
    const firstView = render(
      <MockStateProvider>
        <Probe />
      </MockStateProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(window.localStorage.getItem("foss-yolo-release-0")).not.toBeNull();

    firstView.unmount();
    render(
      <MockStateProvider>
        <Probe />
      </MockStateProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByText("status:queued")).toBeInTheDocument();
    expect(screen.getByText("runs:4")).toBeInTheDocument();
  });

  it("ignores malformed browser-local state", () => {
    window.localStorage.setItem(
      "foss-yolo-release-0",
      JSON.stringify({ userRuns: "broken", userModels: null, activeRunId: 42 }),
    );

    render(
      <MockStateProvider>
        <Probe />
      </MockStateProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByText("status:idle")).toBeInTheDocument();
    expect(screen.getByText("runs:3")).toBeInTheDocument();
  });
});

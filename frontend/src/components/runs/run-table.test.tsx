import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RunTable } from "@/components/runs/run-table";
import { MockStateProvider } from "@/providers/mock-state-provider";

const originalTimeZone = process.env.TZ;

function renderedSeedTimestamp(timeZone: string) {
  process.env.TZ = timeZone;
  render(
    <MockStateProvider>
      <RunTable />
    </MockStateProvider>,
  );
  const timestamp = screen.getByText(/Jul 12,/).textContent;
  cleanup();
  return timestamp;
}

describe("run timestamp display", () => {
  afterEach(() => {
    process.env.TZ = originalTimeZone;
  });

  it("renders the same timestamp on servers and clients in different timezones", () => {
    const serverText = renderedSeedTimestamp("UTC");
    const clientText = renderedSeedTimestamp("Asia/Kolkata");

    expect(clientText).toBe(serverText);
  });
});

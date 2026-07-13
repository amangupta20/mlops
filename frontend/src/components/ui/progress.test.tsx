import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "@/components/ui/progress";

describe("Progress", () => {
  it("exposes its determinate value to assistive technology", () => {
    render(<Progress value={37} aria-label="Storage used" />);

    expect(screen.getByRole("progressbar", { name: "Storage used" })).toHaveAttribute(
      "aria-valuenow",
      "37",
    );
  });
});

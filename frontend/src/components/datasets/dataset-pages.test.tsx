import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DatasetsPage from "@/app/datasets/page";
import ValidationPage from "@/app/datasets/validation/page";

describe("dataset screens", () => {
  it("links the inventory to validation evidence", () => {
    render(<DatasetsPage />);

    expect(screen.getByRole("heading", { name: "Datasets" })).toBeInTheDocument();
    expect(screen.getAllByText("Urban traffic")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "View validation" })[0]).toHaveAttribute(
      "href",
      "/datasets/validation",
    );
  });

  it("shows the seeded validation summary and checks", () => {
    render(<ValidationPage />);

    expect(
      screen.getByRole("heading", { name: "Validation summary" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Checks" })).toBeInTheDocument();
    expect(screen.getByText("2 warnings")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Class distribution" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "car: 38%" })).toHaveAttribute(
      "aria-valuenow",
      "38",
    );
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InferenceWorkspace } from "@/components/inference/inference-workspace";

describe("InferenceWorkspace", () => {
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();
  const fetchMock = vi.fn();

  beforeEach(() => {
    createObjectURL
      .mockReset()
      .mockReturnValueOnce("blob:preview")
      .mockReturnValueOnce("blob:result");
    revokeObjectURL.mockClear();
    fetchMock.mockReset();

    const NativeURL = globalThis.URL;
    class MockURL extends NativeURL {}
    MockURL.createObjectURL = createObjectURL;
    MockURL.revokeObjectURL = revokeObjectURL;
    vi.stubGlobal("URL", MockURL);
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts multipart inference input and displays the returned JPEG", async () => {
    const detections = [
      {
        class_id: 0,
        label: "person",
        confidence: 0.9432,
        box: { x1: 0.1, y1: 0.2, x2: 0.4, y2: 0.8 },
      },
      {
        class_id: 2,
        label: "car",
        confidence: 0.8765,
        box: { x1: 0.5, y1: 0.3, x2: 0.9, y2: 0.7 },
      },
    ];
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        image: {
          content_type: "image/jpeg",
          base64: window.btoa("annotated pixels"),
        },
        detections,
      }),
      headers: new Headers({
        "X-Processing-Time": "31.25 ms",
        "X-Model-Used": "yolo26n",
      }),
    });
    render(<InferenceWorkspace />);

    const runButton = screen.getByRole("button", { name: "Run inference" });
    expect(runButton).toBeDisabled();

    const inputImage = new File(["pixels"], "street.png", {
      type: "image/png",
    });
    fireEvent.change(screen.getByLabelText("Choose image"), {
      target: { files: [inputImage] },
    });
    fireEvent.click(runButton);

    expect(screen.getByText("Processing image")).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    const [url, request] = fetchMock.mock.calls[0] as [
      string,
      { method: string; body: FormData },
    ];
    expect(url).toBe("/infer");
    expect(request.method).toBe("POST");
    expect(request.body.get("image")).toBe(inputImage);
    expect(request.body.get("model_name")).toBe("yolo26n");
    expect(request.body.get("confidence")).toBe("0.42");

    expect(
      await screen.findByRole("img", {
        name: "Inference result for street.png",
      }),
    ).toHaveAttribute("src", "blob:result");
    expect(createObjectURL).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "image/jpeg" }),
    );
    expect(screen.getByText("31.25 ms")).toBeInTheDocument();
    expect(screen.getByText("yolo26n")).toBeInTheDocument();
    expect(screen.getByText("2 detections")).toBeInTheDocument();
    expect(screen.getByText("person")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("car")).toBeInTheDocument();
    expect(screen.getByText("88%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear image" }));
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:preview");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:result");
    expect(runButton).toBeDisabled();
  });

  it("shows request failures without replacing the local preview", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 415,
      json: vi.fn().mockResolvedValue({
        detail: "Only JPEG and PNG images are supported",
      }),
      headers: new Headers(),
    });
    render(<InferenceWorkspace />);

    fireEvent.change(screen.getByLabelText("Choose image"), {
      target: {
        files: [new File(["pixels"], "street.png", { type: "image/png" })],
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Run inference" }));

    expect(
      await screen.findByText("Only JPEG and PNG images are supported"),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Preview for street.png" })).toHaveAttribute(
      "src",
      "blob:preview",
    );
  });

  it("explains which image formats are accepted", () => {
    render(<InferenceWorkspace />);

    fireEvent.change(screen.getByLabelText("Choose image"), {
      target: {
        files: [new File(["notes"], "notes.txt", { type: "text/plain" })],
      },
    });

    expect(screen.getByText("Choose a JPEG or PNG image.")).toBeInTheDocument();
  });
});

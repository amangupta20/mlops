"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { FileImage, Play, RotateCcw, Upload } from "lucide-react";

import {
  DetectionRail,
  type Detection,
} from "@/components/inference/detection-rail";
import { InspectionViewport } from "@/components/inference/inspection-viewport";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png"]);

type InferenceResponse = {
  image: {
    content_type: string;
    base64: string;
  };
  detections: Detection[];
};

type InferenceMetadata = {
  processingTime: string;
  modelUsed: string;
};

export function InferenceWorkspace() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "processing" | "result">(
    "idle",
  );
  const [modelName, setModelName] = useState("yolo26n");
  const [confidence, setConfidence] = useState(42);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [metadata, setMetadata] = useState<InferenceMetadata | null>(null);
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Choose a JPEG or PNG image.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setImageName(file.name);
    setError(null);
    setDetections([]);
    setMetadata(null);
    setPhase("idle");
  }

  async function runInference() {
    if (!imageFile) return;

    setPhase("processing");
    setError(null);
    setResultUrl(null);
    setDetections([]);
    setMetadata(null);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("model_name", modelName);
    formData.append("confidence", (confidence / 100).toString());

    try {
      const response = await fetch("/infer", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const result = (await response.json()) as InferenceResponse;
      const resultBlob = decodeBase64Image(
        result.image.base64,
        result.image.content_type,
      );
      setResultUrl(URL.createObjectURL(resultBlob));
      setDetections(result.detections);
      setMetadata({
        processingTime:
          response.headers.get("X-Processing-Time") ?? "Not provided",
        modelUsed: response.headers.get("X-Model-Used") ?? "Not provided",
      });
      setPhase("result");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Inference request failed.",
      );
      setPhase("idle");
    }
  }

  function reset() {
    setImageFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setImageName(null);
    setError(null);
    setDetections([]);
    setMetadata(null);
    setPhase("idle");
    setInputKey((current) => current + 1);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Input image</CardTitle>
            <CardDescription>
              JPEG or PNG, sent only when you run inference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="inference-image"
              className="group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input bg-muted/45 px-5 text-center transition-colors hover:border-primary/45 hover:bg-accent/45 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
            >
              <span className="grid size-10 place-items-center rounded-lg border bg-card text-primary shadow-sm">
                {imageName ? (
                  <FileImage className="size-4" aria-hidden="true" />
                ) : (
                  <Upload className="size-4" aria-hidden="true" />
                )}
              </span>
              <span className="mt-3 max-w-full truncate text-sm font-medium">
                {imageName ?? "Choose an image"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                JPEG or PNG
              </span>
            </label>
            <input
              key={inputKey}
              id="inference-image"
              aria-label="Choose image"
              type="file"
              accept="image/jpeg,image/png"
              className="sr-only"
              disabled={phase === "processing"}
              onChange={chooseImage}
            />
            {error ? (
              <p className="mt-2 text-xs font-medium text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model settings</CardTitle>
            <CardDescription>
              Values sent to the inference API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="model-select">Model</Label>
              <Select value={modelName} onValueChange={setModelName}>
                <SelectTrigger id="model-select" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yolo26n">YOLO26n</SelectItem>
                  <SelectItem value="yolo26s">YOLO26s</SelectItem>
                  <SelectItem value="yolo26m">YOLO26m</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="confidence-slider">Confidence</Label>
                <span className="font-data text-xs font-semibold">
                  {(confidence / 100).toFixed(2)}
                </span>
              </div>
              <Slider
                id="confidence-slider"
                value={[confidence]}
                min={10}
                max={90}
                step={1}
                onValueChange={(value) => setConfidence(value[0])}
                aria-label="Confidence threshold"
              />
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button
                size="lg"
                className="h-10"
                onClick={runInference}
                disabled={!imageFile || phase === "processing"}
              >
                <Play data-icon="inline-start" />
                Run inference
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                onClick={reset}
                disabled={!imageFile || phase === "processing"}
                aria-label="Clear image"
              >
                <RotateCcw aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-[0_24px_70px_-52px_rgb(23_32_31/0.75)]">
        <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_14rem]">
          <InspectionViewport
            imageUrl={resultUrl ?? previewUrl}
            imageName={imageName}
            phase={phase}
            isResult={Boolean(resultUrl)}
          />
          {phase === "result" && metadata ? (
            <DetectionRail
              detections={detections}
              processingTime={metadata.processingTime}
              modelUsed={metadata.modelUsed}
            />
          ) : (
            <aside className="hidden border-l bg-card lg:flex lg:flex-col">
              <div className="border-b px-4 py-3">
                <p className="font-heading text-sm font-semibold">Objects</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Waiting for a result
                </p>
              </div>
              <div className="grid flex-1 place-items-center px-6 text-center text-xs leading-5 text-muted-foreground">
                The annotated image and response metadata will appear here.
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function decodeBase64Image(base64: string, contentType: string) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: contentType });
}

async function readErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === "string") return body.detail;
  } catch {
    // Fall through to the status-based message for non-JSON errors.
  }

  return `Inference failed with status ${response.status}.`;
}

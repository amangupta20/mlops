"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { FileImage, Play, RotateCcw, Upload } from "lucide-react";

import { DetectionRail } from "@/components/inference/detection-rail";
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

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function InferenceWorkspace() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "processing" | "result">(
    "idle",
  );
  const [confidence, setConfidence] = useState(42);
  const [inputKey, setInputKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [imageUrl],
  );

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setImageName(file.name);
    setError(null);
    setPhase("idle");
  }

  function runInference() {
    if (!imageUrl) return;
    setPhase("processing");
    timerRef.current = window.setTimeout(() => {
      setPhase("result");
    }, 1_200);
  }

  function reset() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageName(null);
    setError(null);
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
              The file stays in this browser preview.
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
                JPEG, PNG or WebP
              </span>
            </label>
            <input
              key={inputKey}
              id="inference-image"
              aria-label="Choose image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
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
              Presentation values for this mock run.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="model-select">Model</Label>
              <Select defaultValue="yolo11n">
                <SelectTrigger id="model-select" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yolo11n">YOLO11n · built-in</SelectItem>
                  <SelectItem value="traffic">Urban traffic · v0.3.1</SelectItem>
                  <SelectItem value="warehouse">Warehouse safety · v0.2.0</SelectItem>
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
                disabled={!imageUrl || phase === "processing"}
              >
                <Play data-icon="inline-start" />
                Run inference
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                onClick={reset}
                disabled={!imageUrl}
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
            imageUrl={imageUrl}
            imageName={imageName}
            phase={phase}
            confidence={confidence}
          />
          {phase === "result" ? (
            <DetectionRail confidence={confidence} />
          ) : (
            <aside className="hidden border-l bg-card lg:flex lg:flex-col">
              <div className="border-b px-4 py-3">
                <p className="font-heading text-sm font-semibold">Objects</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Waiting for a result
                </p>
              </div>
              <div className="grid flex-1 place-items-center px-6 text-center text-xs leading-5 text-muted-foreground">
                Detections and timing will appear here after the mock run.
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

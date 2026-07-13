"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrainingConfig } from "@/lib/mock-data";
import { useMockState } from "@/providers/mock-state-provider";

const DEFAULT_CONFIG: TrainingConfig = {
  datasetId: "dataset-traffic-v3",
  baseModel: "yolo11n",
  epochs: 40,
  batchSize: 16,
  imageSize: 640,
  device: "GPU 0",
};

export function TrainingForm() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const { activeRun, startTraining } = useMockState();
  const router = useRouter();
  const hasActiveRun = activeRun !== null && activeRun.status !== "completed";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasActiveRun) {
      router.push("/training/active");
      return;
    }
    startTraining(config);
    router.push("/training/active");
  }

  return (
    <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <fieldset disabled={hasActiveRun} className="contents">
      <div className="space-y-5">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Data and base model</CardTitle>
            <CardDescription>
              Choose the illustrative inputs for this browser-only run.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 pt-1 sm:grid-cols-2">
            <Field label="Dataset" id="training-dataset">
              <Select
                value={config.datasetId}
                onValueChange={(datasetId) => setConfig({ ...config, datasetId })}
              >
                <SelectTrigger id="training-dataset" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dataset-traffic-v3">Urban traffic · v3</SelectItem>
                  <SelectItem value="dataset-warehouse-v2">Warehouse safety · v2</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Base model" id="training-model">
              <Select
                value={config.baseModel}
                onValueChange={(baseModel) => setConfig({ ...config, baseModel })}
              >
                <SelectTrigger id="training-model" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yolo11n">YOLO11n · 5.4 MB</SelectItem>
                  <SelectItem value="yolo11s">YOLO11s · 18.2 MB</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Training parameters</CardTitle>
            <CardDescription>
              These controls demonstrate the intended configuration surface, not a final contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 pt-1 sm:grid-cols-2 lg:grid-cols-4">
            <NumberField
              id="epochs"
              label="Epochs"
              value={config.epochs}
              min={1}
              onChange={(epochs) => setConfig({ ...config, epochs })}
            />
            <NumberField
              id="batch-size"
              label="Batch size"
              value={config.batchSize}
              min={1}
              onChange={(batchSize) => setConfig({ ...config, batchSize })}
            />
            <NumberField
              id="image-size"
              label="Image size"
              value={config.imageSize}
              min={320}
              step={32}
              onChange={(imageSize) => setConfig({ ...config, imageSize })}
            />
            <Field label="Device" id="training-device">
              <Select
                value={config.device}
                onValueChange={(device) => setConfig({ ...config, device })}
              >
                <SelectTrigger id="training-device" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GPU 0">GPU 0 · mock</SelectItem>
                  <SelectItem value="CPU">CPU · mock</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>
      </div>
      </fieldset>

      <Card className="h-fit xl:sticky xl:top-24">
        <CardHeader>
          <CardTitle>Run summary</CardTitle>
          <CardDescription>Review the visible choices before starting.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm">
            {[
              ["Dataset", config.datasetId.replace("dataset-", "")],
              ["Model", config.baseModel],
              ["Epochs", config.epochs],
              ["Batch", config.batchSize],
              ["Image size", `${config.imageSize}px`],
              ["Device", config.device],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b pb-3 last:border-0">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-data text-right text-xs font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex gap-2 rounded-lg bg-accent/60 p-3 text-xs leading-5 text-accent-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {hasActiveRun
              ? "A mock run is already active. Continue there before starting another."
              : "The run completes automatically in about 24 seconds."}
          </div>
          <Button
            type={hasActiveRun ? "button" : "submit"}
            size="lg"
            className="mt-4 h-10 w-full"
            onClick={hasActiveRun ? () => router.push("/training/active") : undefined}
          >
            {hasActiveRun ? "View active run" : "Start training"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  min,
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} id={id}>
      <Input
        id={id}
        type="number"
        min={min}
        step={step}
        value={value}
        required
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
      />
    </Field>
  );
}

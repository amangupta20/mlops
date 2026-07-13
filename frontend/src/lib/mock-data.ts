import type { RunStatus } from "@/lib/mock-run";

export type TrainingConfig = {
  datasetId: string;
  baseModel: string;
  epochs: number;
  batchSize: number;
  imageSize: number;
  device: string;
};

export type MockRun = {
  id: string;
  name: string;
  type: "training" | "inference" | "validation";
  status: RunStatus | "failed";
  startedAt: number;
  endedAt?: number;
  progress: number;
  config: TrainingConfig;
  metrics: {
    map50: number;
    map5095: number;
    precision: number;
    recall: number;
    boxLoss: number;
  };
};

export type MockModel = {
  id: string;
  name: string;
  version: string;
  state: "candidate" | "approved";
  sourceRun: string;
  baseModel: string;
  framework: string;
  task: string;
  map50: number;
  createdAt: number;
  size: string;
};

export type MockDataset = {
  id: string;
  name: string;
  version: string;
  status: "valid" | "validating" | "invalid";
  images: number;
  labels: number;
  classes: number;
  size: string;
  createdAt: string;
};

export type MockDetection = {
  id: string;
  label: string;
  confidence: number;
  color: string;
  box: { left: number; top: number; width: number; height: number };
};

export const MOCK_DATASETS: MockDataset[] = [
  {
    id: "dataset-traffic-v3",
    name: "Urban traffic",
    version: "v3",
    status: "valid",
    images: 12_480,
    labels: 38_921,
    classes: 8,
    size: "4.8 GB",
    createdAt: "Jul 12, 2026",
  },
  {
    id: "dataset-warehouse-v2",
    name: "Warehouse safety",
    version: "v2",
    status: "valid",
    images: 6_240,
    labels: 14_892,
    classes: 5,
    size: "2.1 GB",
    createdAt: "Jul 09, 2026",
  },
  {
    id: "dataset-loading-bay-v1",
    name: "Loading bay",
    version: "v1",
    status: "validating",
    images: 3_106,
    labels: 7_554,
    classes: 4,
    size: "1.2 GB",
    createdAt: "Jul 13, 2026",
  },
];

export const MOCK_VALIDATION_REPORT = {
  dataset: MOCK_DATASETS[0],
  summary: {
    passed: 9,
    warnings: 2,
    failed: 0,
    duration: "01:42",
  },
  checks: [
    { name: "Dataset manifest", status: "passed", detail: "data.yaml resolved" },
    { name: "Image readability", status: "passed", detail: "12,480 readable" },
    { name: "Label syntax", status: "passed", detail: "38,921 labels parsed" },
    { name: "Class identifiers", status: "passed", detail: "8 classes in range" },
    { name: "Image-label pairing", status: "warning", detail: "17 images have no label" },
    { name: "Duplicate content", status: "warning", detail: "6 likely duplicate images" },
  ],
  classes: [
    { name: "car", count: 14_820, percent: 38 },
    { name: "person", count: 9_341, percent: 24 },
    { name: "truck", count: 5_059, percent: 13 },
    { name: "bus", count: 3_503, percent: 9 },
    { name: "bicycle", count: 2_724, percent: 7 },
    { name: "other", count: 3_474, percent: 9 },
  ],
};

const seedConfig: TrainingConfig = {
  datasetId: "dataset-traffic-v3",
  baseModel: "yolo11n",
  epochs: 40,
  batchSize: 16,
  imageSize: 640,
  device: "GPU 0",
};

export const MOCK_RUNS: MockRun[] = [
  {
    id: "train-2047",
    name: "urban-traffic / yolo11n",
    type: "training",
    status: "completed",
    startedAt: Date.parse("2026-07-12T14:22:00Z"),
    endedAt: Date.parse("2026-07-12T15:40:18Z"),
    progress: 100,
    config: seedConfig,
    metrics: {
      map50: 0.842,
      map5095: 0.619,
      precision: 0.881,
      recall: 0.796,
      boxLoss: 0.031,
    },
  },
  {
    id: "train-2042",
    name: "warehouse-safety / yolo11s",
    type: "training",
    status: "completed",
    startedAt: Date.parse("2026-07-11T08:05:00Z"),
    endedAt: Date.parse("2026-07-11T10:19:43Z"),
    progress: 100,
    config: { ...seedConfig, datasetId: "dataset-warehouse-v2", baseModel: "yolo11s" },
    metrics: {
      map50: 0.811,
      map5095: 0.587,
      precision: 0.854,
      recall: 0.773,
      boxLoss: 0.038,
    },
  },
  {
    id: "train-2039",
    name: "urban-traffic / yolo11n",
    type: "training",
    status: "failed",
    startedAt: Date.parse("2026-07-10T16:30:00Z"),
    endedAt: Date.parse("2026-07-10T16:34:12Z"),
    progress: 12,
    config: seedConfig,
    metrics: {
      map50: 0,
      map5095: 0,
      precision: 0,
      recall: 0,
      boxLoss: 0,
    },
  },
];

export const MOCK_MODELS: MockModel[] = [
  {
    id: "model-traffic-031",
    name: "urban-traffic-detector",
    version: "v0.3.1",
    state: "candidate",
    sourceRun: "train-2047",
    baseModel: "yolo11n",
    framework: "Ultralytics",
    task: "Object detection",
    map50: 0.842,
    createdAt: Date.parse("2026-07-12T15:40:18Z"),
    size: "5.7 MB",
  },
  {
    id: "model-warehouse-020",
    name: "warehouse-safety",
    version: "v0.2.0",
    state: "approved",
    sourceRun: "train-2042",
    baseModel: "yolo11s",
    framework: "Ultralytics",
    task: "Object detection",
    map50: 0.811,
    createdAt: Date.parse("2026-07-11T10:19:43Z"),
    size: "18.4 MB",
  },
  {
    id: "model-traffic-base",
    name: "yolo11n",
    version: "built-in",
    state: "approved",
    sourceRun: "built-in",
    baseModel: "yolo11n",
    framework: "Ultralytics",
    task: "Object detection",
    map50: 0.0,
    createdAt: Date.parse("2026-07-01T00:00:00Z"),
    size: "5.4 MB",
  },
];

export const MOCK_DETECTIONS: MockDetection[] = [
  {
    id: "det-1",
    label: "person",
    confidence: 0.94,
    color: "#59d5c7",
    box: { left: 12, top: 17, width: 21, height: 63 },
  },
  {
    id: "det-2",
    label: "car",
    confidence: 0.89,
    color: "#7fa7ff",
    box: { left: 51, top: 44, width: 37, height: 32 },
  },
  {
    id: "det-3",
    label: "backpack",
    confidence: 0.76,
    color: "#f2b455",
    box: { left: 24, top: 35, width: 11, height: 28 },
  },
];

export const MOCK_SERVICES = [
  { name: "API", status: "online", latency: "18 ms", detail: "Mock gateway" },
  { name: "Training worker", status: "online", latency: "Idle", detail: "GPU worker 01" },
  { name: "Artifact storage", status: "online", latency: "8.4 GB", detail: "Local fixture" },
  { name: "GPU", status: "online", latency: "12%", detail: "NVIDIA RTX mock" },
] as const;

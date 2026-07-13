"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MOCK_MODELS,
  MOCK_RUNS,
  type MockModel,
  type MockRun,
  type TrainingConfig,
} from "@/lib/mock-data";
import { progressForElapsed, statusForElapsed } from "@/lib/mock-run";

const STORAGE_KEY = "foss-yolo-release-0";
const STORAGE_VERSION = 1;

type StoredState = {
  version: typeof STORAGE_VERSION;
  userRuns: MockRun[];
  userModels: MockModel[];
  activeRunId: string | null;
};

type MockStateValue = {
  activeRun: MockRun | null;
  runs: MockRun[];
  models: MockModel[];
  startTraining: (config: TrainingConfig) => MockRun;
  resetDemo: () => void;
};

const MockStateContext = createContext<MockStateValue | null>(null);

const EMPTY_STATE: StoredState = {
  version: STORAGE_VERSION,
  userRuns: [],
  userModels: [],
  activeRunId: null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredState(value: unknown): value is StoredState {
  if (!isRecord(value)) return false;

  return (
    value.version === STORAGE_VERSION &&
    Array.isArray(value.userRuns) &&
    Array.isArray(value.userModels) &&
    (value.activeRunId === null || typeof value.activeRunId === "string")
  );
}

function createdModelFor(run: MockRun): MockModel {
  return {
    id: `model-${run.id}`,
    name: `${run.config.datasetId.replace("dataset-", "")}-detector`,
    version: "v0.1.0-candidate",
    state: "candidate",
    sourceRun: run.id,
    baseModel: run.config.baseModel,
    framework: "Ultralytics",
    task: "Object detection",
    map50: run.metrics.map50,
    createdAt: run.endedAt ?? Date.now(),
    size: run.config.baseModel === "yolo11s" ? "18.4 MB" : "5.8 MB",
  };
}

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [userRuns, setUserRuns] = useState<MockRun[]>(EMPTY_STATE.userRuns);
  const [userModels, setUserModels] = useState<MockModel[]>(
    EMPTY_STATE.userModels,
  );
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (isStoredState(parsed)) {
            setUserRuns(parsed.userRuns);
            setUserModels(parsed.userModels);
            setActiveRunId(parsed.activeRunId);
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        hydrated.current = true;
      }
    }, 0);

    return () => window.clearTimeout(hydrationTask);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        userRuns,
        userModels,
        activeRunId,
      } satisfies StoredState),
    );
  }, [activeRunId, userModels, userRuns]);

  const activeRun = useMemo(
    () => userRuns.find((run) => run.id === activeRunId) ?? null,
    [activeRunId, userRuns],
  );

  useEffect(() => {
    if (!activeRun || activeRun.status === "completed") return;

    const update = () => {
      const elapsed = Date.now() - activeRun.startedAt;
      const nextStatus = statusForElapsed(elapsed);
      const completed = nextStatus === "completed";
      const updated: MockRun = {
        ...activeRun,
        status: nextStatus,
        progress: progressForElapsed(elapsed),
        endedAt: completed ? activeRun.startedAt + 24_000 : undefined,
        metrics: {
          map50: completed ? 0.857 : Math.min(0.857, elapsed / 29_000),
          map5095: completed ? 0.634 : Math.min(0.634, elapsed / 38_000),
          precision: completed ? 0.887 : Math.min(0.887, elapsed / 27_000),
          recall: completed ? 0.809 : Math.min(0.809, elapsed / 30_000),
          boxLoss: completed ? 0.028 : Math.max(0.028, 0.19 - elapsed / 150_000),
        },
      };

      setUserRuns((current) =>
        current.map((run) => (run.id === updated.id ? updated : run)),
      );

      if (completed) {
        setUserModels((current) =>
          current.some((model) => model.sourceRun === updated.id)
            ? current
            : [createdModelFor(updated), ...current],
        );
      }
    };

    const interval = window.setInterval(update, 500);
    return () => window.clearInterval(interval);
  }, [activeRun]);

  const startTraining = useCallback((config: TrainingConfig) => {
    if (activeRun && activeRun.status !== "completed") {
      return activeRun;
    }

    const startedAt = Date.now();
    const id = `train-${startedAt.toString(36)}`;
    const run: MockRun = {
      id,
      name: `${config.datasetId.replace("dataset-", "")} / ${config.baseModel}`,
      type: "training",
      status: "queued",
      startedAt,
      progress: 2,
      config,
      metrics: {
        map50: 0,
        map5095: 0,
        precision: 0,
        recall: 0,
        boxLoss: 0.19,
      },
    };

    setUserRuns((current) => [run, ...current]);
    setActiveRunId(id);
    return run;
  }, [activeRun]);

  const resetDemo = useCallback(() => {
    setUserRuns([]);
    setUserModels([]);
    setActiveRunId(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<MockStateValue>(
    () => ({
      activeRun,
      runs: [...userRuns, ...MOCK_RUNS],
      models: [...userModels, ...MOCK_MODELS],
      startTraining,
      resetDemo,
    }),
    [activeRun, resetDemo, startTraining, userModels, userRuns],
  );

  return (
    <MockStateContext.Provider value={value}>
      {children}
    </MockStateContext.Provider>
  );
}

export function useMockState() {
  const context = useContext(MockStateContext);
  if (!context) {
    throw new Error("useMockState must be used within MockStateProvider");
  }
  return context;
}

import { ImageIcon, LoaderCircle, ScanLine } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type InspectionViewportProps = {
  imageUrl: string | null;
  imageName: string | null;
  phase: "idle" | "processing" | "result";
  isResult: boolean;
};

export function InspectionViewport({
  imageUrl,
  imageName,
  phase,
  isResult,
}: InspectionViewportProps) {
  return (
    <div className="relative min-h-[25rem] overflow-hidden bg-[#15201f] lg:min-h-[38rem]">
      <div className="lab-grid absolute inset-0 opacity-25" />

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${isResult ? "Inference result" : "Preview"} for ${imageName ?? "selected image"}`}
          fill
          unoptimized
          className="object-contain"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center px-8 text-center text-white/60">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/5">
              <ImageIcon className="size-6" aria-hidden="true" />
            </span>
            <p className="font-heading mt-4 text-sm font-medium text-white/85">
              Inspection viewport
            </p>
            <p className="mt-1 text-xs leading-5">
              Choose an image to prepare the local preview.
            </p>
          </div>
        </div>
      )}

      {phase === "processing" ? (
        <div className="absolute inset-0 grid place-items-center bg-[#101918]/76 backdrop-blur-[2px]">
          <div className="text-center text-white">
            <LoaderCircle
              className="mx-auto size-7 animate-spin text-[#65d6c9]"
              aria-hidden="true"
            />
            <p className="font-heading mt-3 text-sm font-medium">
              Processing image
            </p>
            <p className="font-data mt-1 text-[0.62rem] tracking-[0.12em] text-white/55 uppercase">
              Running model inference
            </p>
          </div>
        </div>
      ) : null}

      <ViewportCorner className="top-4 left-4 border-t border-l" />
      <ViewportCorner className="top-4 right-4 border-t border-r" />
      <ViewportCorner className="bottom-4 left-4 border-b border-l" />
      <ViewportCorner className="right-4 bottom-4 border-r border-b" />

      <div className="absolute top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-white backdrop-blur-md">
        <ScanLine className="size-3 text-[#65d6c9]" aria-hidden="true" />
        <span className="font-data text-[0.58rem] tracking-[0.12em] uppercase">
          {phase === "result" ? "Server result" : "Viewport ready"}
        </span>
      </div>
    </div>
  );
}

function ViewportCorner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-6 border-[#65d6c9]/80",
        className,
      )}
    />
  );
}

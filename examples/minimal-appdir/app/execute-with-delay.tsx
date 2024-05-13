"use client";

import { jobs } from "@/utils/queuebase";

export default function ExecuteWithDelay() {
  return (
    <button
      onClick={() => {
        jobs("delayExample").enqueue(undefined, { delay: 30 });
      }}
      className="px h-10 rounded-md border bg-emerald-600 px-4 py-2 text-white"
    >
      Execute job with delay
    </button>
  );
}

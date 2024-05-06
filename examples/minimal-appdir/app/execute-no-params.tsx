"use client";

import { jobs } from "@/utils/queuebase";

export default function ExecuteJobNoParams() {
  return (
    <button
      onClick={() => {
        jobs("sayHello").enqueue();
      }}
      className="px h-10 rounded-md border bg-emerald-600 px-4 py-2 text-white"
    >
      Execute job without input
    </button>
  );
}

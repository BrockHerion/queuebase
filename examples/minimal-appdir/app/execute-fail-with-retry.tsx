"use client";

import { jobs } from "@/utils/queuebase";

export default function ExecuteFailureWithRetry() {
  return (
    <button
      onClick={() => {
        jobs("failWithRetry").enqueue();
      }}
      className="px h-10 rounded-md border bg-rose-600 px-4 py-2 text-white"
    >
      Execute job that will fail but retry
    </button>
  );
}

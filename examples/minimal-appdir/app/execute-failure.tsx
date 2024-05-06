"use client";

import { jobs } from "@/utils/queuebase";

export default function ExecuteFailure() {
  return (
    <button
      onClick={() => {
        jobs("failure").enqueue();
      }}
      className="px h-10 rounded-md border bg-rose-600 px-4 py-2 text-white"
    >
      Execute job that will fail
    </button>
  );
}

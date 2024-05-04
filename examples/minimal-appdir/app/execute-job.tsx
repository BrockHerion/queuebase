"use client";

import { jobs } from "@/utils/queuebase";

export default function ExecuteJob() {
  return (
    <button
      onClick={() => {
        jobs("sayHelloWithName").enqueue({ name: "World" });
      }}
      className="px h-10 rounded-md border bg-emerald-600 px-4 py-2 text-white"
    >
      Execute
    </button>
  );
}

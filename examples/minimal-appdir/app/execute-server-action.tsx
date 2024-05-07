"use client";

import executeServer from "./actions";

export default function ExecuteJobServer() {
  return (
    <button
      onClick={async () => {
        await executeServer();
      }}
      className="px h-10 rounded-md border bg-emerald-600 px-4 py-2 text-white"
    >
      Execute job from server action
    </button>
  );
}

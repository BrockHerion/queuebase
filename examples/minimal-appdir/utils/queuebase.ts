import type { JobRouter } from "@/app/api/queuebase/core";
import { createQueuebaseClient } from "queuebase/client";

export const { jobs } = createQueuebaseClient<JobRouter>({
  apiKey: process.env.NEXT_PUBLIC_QUEUEBASE_API_KEY!,
  queuebaseUrl: process.env.NEXT_PUBLIC_QUEUEBASE_URL,
});

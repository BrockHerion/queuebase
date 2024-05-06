<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/Q.svg?raw=true">
    <img src="./assets/Q.svg?raw=true" width="480" height="80" alt="Logo for Queuebase">
  </picture>
</p>

# Queuebase

Background jobs in Next.js made easy.

## Next.js App Router Setup

### Setup your environment

#### 1. Install packages

```shell
npm i queuebase zod
```

#### 2. Add environment variables

```env
# .env.local

NEXT_PUBLIC_QUEUEBASE_API_KEY=... # Your Queuebase API key
QUEUEBASE_SECRET_KEY=... # Your Queuebase secret key
```

### Creating the job router

#### 1. Define the router

All jobs in Queuebase are associated with a route. The example below is a very simple of example of creating a job router.

```ts
// api/queuebase/core.ts

import { type JobRouter as QueuebaseJobRouter } from "queuebase/lib/types";
import { createQueuebase } from "queuebase/next";
import { z } from "zod";

export const jobRouter = {
  sayHello: j().handler(() => {
    console.log("Hello there!");
  }),
} satisfies QueuebaseJobRouter;

export type JobRouter = typeof jobRouter;
```

#### 2. Create the route handler

When a job is triggered, Queuebase will send a POST request to this endpoint with the job name and any job parameters needed. This route MUST match the route you defined in the dashboard.

```ts
// api/queuebase/route.ts

import { createRouteHandler } from "queuebase/next";
import { jobRouter } from "./core";

export const { POST } = createRouteHandler({
  router: jobRouter,
});
```

#### 3. Setup the job client

Here's where the magic happens. The `jobs` object contains all your jobs defined in your router and allows you trigger them. Oh, and did we mention it's completely type-safe?

```ts
// utils/queuebase.ts

import type { JobRouter } from "@/app/api/queuebase/core";
import { createQueuebaseClient } from "queuebase/client";

export const { jobs } = createQueuebaseClient<JobRouter>({
  apiKey: process.env.NEXT_PUBLIC_QUEUEBASE_API_KEY!,
});
```

### Invoke a job

In a client component:

```jsx
// app/execute-job.tsx

"use client";

import { jobs } from "@/utils/queuebase";

export default function ExecuteJob() {
  return (
    <button
	  className="px h-10 rounded-md border bg-emerald-600 px-4 py-2 text-white"
      onClick={() => { 
		jobs("sayHello").enqueue(); 
	  }} >
      Execute job without input
    </button>
  );
}
```

In a server component: 

TODO

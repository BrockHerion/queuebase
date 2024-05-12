import { type JobRouter as QueuebaseJobRouter } from "queuebase/lib/types";
import { createPagesApiHandler, createQueuebase } from "queuebase/next";

const j = createQueuebase();

export const jobRouter = {
  helloFromPages: j()
    .config({
      retries: 1,
      friendlyName: "Hello from pages",
      description:
        "A simple job that logs 'Hello from the job!' from the Next.js pages router",
    })
    .handler(() => {
      console.log("Hello from pages!");
    }),
} satisfies QueuebaseJobRouter;

export type JobRouter = typeof jobRouter;

const handler = createPagesApiHandler({
  router: jobRouter,
});

export default handler;

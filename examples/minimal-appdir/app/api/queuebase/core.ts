import { type JobRouter as QueuebaseJobRouter } from "queuebase/lib/types";
import { createQueuebase } from "queuebase/next";
import { z } from "zod";

const j = createQueuebase();

export const jobRouter = {
  sayHello: j().handler(() => {
    console.log("Hello from the job!");
  }),
  sayHelloWithName: j()
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .handler(({ input }) => {
      console.log(`Hello, ${input.name}!`);
    }),
  failure: j().handler(() => {
    const error = true;
    if (error) {
      throw new Error("This job always fails");
    }

    console.log("This job never runs");
  }),
  doesNotExist: j().handler(() => {
    console.log("This job doesn't exist yet");
  }),
  archive: j().handler(() => {
    console.log("This job should be archived");
  }),
  cronJob: j().handler(() => {
    console.log("This job should run every minute");
  }),
} satisfies QueuebaseJobRouter;

export type JobRouter = typeof jobRouter;

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
} satisfies QueuebaseJobRouter;

export type JobRouter = typeof jobRouter;

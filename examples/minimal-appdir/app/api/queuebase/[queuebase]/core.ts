import { createQueuebase } from "queuebase/next";

const j = createQueuebase();

export const jobRouter = {
  sayHello: j().handler(() => {
    console.log("Hello from the job!");
  }),
};

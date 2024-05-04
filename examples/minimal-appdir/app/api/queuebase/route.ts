import { createRouteHandler } from "queuebase/next";
import { jobRouter } from "./core";

export const { POST } = createRouteHandler({
  router: jobRouter,
});

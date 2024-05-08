import { createRouteHandler } from "queuebase/next";
import { jobRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: jobRouter,
});

import { createAppRouteHandler } from "queuebase/next";
import { jobRouter } from "./core";

export const { GET, POST } = createAppRouteHandler({
  router: jobRouter,
});

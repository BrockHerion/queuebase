import { NextRequest } from "next/server";
import { createBuilder } from "./lib/job-builder";
import { INTERNAL_DO_NOT_USE_createRouteHandler } from "./server";

export const createQueuebase = () =>
  createBuilder<{ req: NextRequest; res: undefined }>();

export const createRouteHandler = () => {
  const handlers = INTERNAL_DO_NOT_USE_createRouteHandler();

  return {
    POST: (req: NextRequest) => handlers.POST(req),
  };
};

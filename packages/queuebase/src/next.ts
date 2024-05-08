import { NextRequest } from "next/server";
import { createBuilder } from "./lib/job-builder";
import { JobRouter, RouteHandlerOptions } from "./lib/types";
import { INTERNAL_DO_NOT_USE_createRouteHandler } from "./server";

export const createQueuebase = () =>
  createBuilder<{ req: NextRequest; res: undefined }>();

export const createRouteHandler = <TRouter extends JobRouter>(
  opts: RouteHandlerOptions<TRouter>,
) => {
  const handlers = INTERNAL_DO_NOT_USE_createRouteHandler(opts);

  return {
    GET: (req: NextRequest) => handlers.GET(req),
    POST: (req: NextRequest) => handlers.POST(req),
  };
};

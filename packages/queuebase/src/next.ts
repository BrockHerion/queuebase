import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { createBuilder } from "./lib/job-builder";
import toWebRequest from "./lib/to-web-request";
import { JobRouter, RouteHandlerOptions } from "./lib/types";
import { INTERNAL_DO_NOT_USE_createRouteHandler } from "./server";

export const createQueuebase = () =>
  createBuilder<{ req: NextRequest; res: undefined }>();

export const createAppRouteHandler = <TRouter extends JobRouter>(
  opts: RouteHandlerOptions<TRouter>,
) => {
  const handlers = INTERNAL_DO_NOT_USE_createRouteHandler(opts);

  return {
    GET: (req: NextRequest) => handlers.GET(req),
    POST: (req: NextRequest) => handlers.POST(req),
  };
};

export const createPagesApiHandler = <TRouter extends JobRouter>(
  opts: RouteHandlerOptions<TRouter>,
) => {
  const handlers = INTERNAL_DO_NOT_USE_createRouteHandler(opts);

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const webReq = toWebRequest(req);

    if (req.method === "GET") {
      const response = await handlers.GET({ request: webReq });
      const body = await response.json();

      res.status(response.status).json(body);
      return;
    }

    if (req.method === "POST") {
      const response = await handlers.POST({ request: webReq });

      if (response.status === 204) {
        res.status(response.status).end();
      } else {
        res.status(response.status).json({ error: "Failed to run job" });
      }

      return;
    }

    return res.status(405);
  };
};

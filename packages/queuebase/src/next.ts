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
    GET: async (req: NextRequest) => {
      const result = await handlers.GET(req);

      if (!result) {
        return new Response(null, { status: 401 });
      }

      return new Response(JSON.stringify(result), { status: 200 });
    },
    POST: async (req: NextRequest) => {
      const result = await handlers.POST(req);

      if (result.success) {
        return new Response(null, { status: 204 });
      }

      return new Response(JSON.stringify({ error: "Failed to run job" }), {
        status: 500,
      });
    },
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

      if (!response) {
        return res.status(401);
      }

      res.status(200).json(res);
      return;
    }

    if (req.method === "POST") {
      const result = await handlers.POST({ request: webReq });

      if (result.success) {
        res.status(204).end();
      } else {
        res.status(500).json({ error: "Failed to run job" });
      }

      return;
    }

    return res.status(405);
  };
};

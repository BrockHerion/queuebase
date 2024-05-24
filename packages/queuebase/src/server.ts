import { verifySignature } from "./lib/crypto";
import { buildRequestHandler, runRequestHandler } from "./lib/handler";
import { JobRouter, RouteHandlerOptions } from "./lib/types";
import { validateSignature } from "./lib/validate-request";

/** @internal */
export function INTERNAL_DO_NOT_USE_createRouteHandler<
  TRouter extends JobRouter,
>(opts: RouteHandlerOptions<TRouter>) {
  const requestHandler = buildRequestHandler<TRouter>(opts);

  const GET = async (request: Request | { request: Request }) => {
    const req = request instanceof Request ? request : request.request;
    const secretKey = validateSignature(req);

    const validationResult = await verifySignature(
      "",
      req.headers.get("X-Queuebase-Signature"),
      secretKey,
    );

    if (!validationResult) {
      console.error("Invalid signature");
      return null;
    }

    const jobs = Object.keys(opts.router);
    const res = [];

    for (const job of jobs) {
      const config = opts.router[job]._def.config;
      res.push({ name: job, ...config });
    }

    return res;
  };

  const POST = async (request: Request | { request: Request }) => {
    const req = request instanceof Request ? request : request.request;

    const response = await runRequestHandler(requestHandler, { req });

    if (!response.success) {
      console.error("Failed to run job");
      return { success: false };
    }

    console.log("Job ran successfully");
    return { success: true };
  };

  return {
    GET,
    POST,
  };
}

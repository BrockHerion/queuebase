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
    validateSignature(req);

    const jobs = Object.keys(opts.router);

    return new Response(JSON.stringify(jobs), { status: 200 });
  };

  const POST = async (request: Request | { request: Request }) => {
    const req = request instanceof Request ? request : request.request;

    const response = await runRequestHandler(requestHandler, { req });

    if (!response.success) {
      console.error("Failed to run job");
      return new Response(null, { status: 500 });
    }

    console.log("Job ran successfully");
    return new Response(null, { status: 204 });
  };

  return {
    GET,
    POST,
  };
}

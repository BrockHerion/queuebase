import { buildRequestHandler, runRequestHandler } from "./lib/handler";
import { JobRouter, RouteHandlerOptions } from "./lib/types";

/** @internal */
export function INTERNAL_DO_NOT_USE_createRouteHandler<
  TRouter extends JobRouter,
>(opts: RouteHandlerOptions<TRouter>) {
  const requestHandler = buildRequestHandler<TRouter>(opts);

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
    POST,
  };
}

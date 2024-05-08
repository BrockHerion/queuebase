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
      return new Response(null, { status: 401 });
    }

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

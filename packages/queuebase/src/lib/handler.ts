import { verifySignature } from "./crypto";
import {
  JobRouter,
  RequestHandler,
  RequestHandlerInput,
  RouteHandlerOptions,
} from "./types";
import { parseAndValidateRequest } from "./validate-request";

export async function runRequestHandler(
  handler: RequestHandler,
  args: RequestHandlerInput,
) {
  const { slug, job, req, secretKey } = await handler(args);

  // Validate the request signature
  const validationResult = await verifySignature(
    await req.clone().text(),
    req.headers.get("X-Queuebase-Signature"),
    secretKey,
  );

  if (!validationResult) {
    console.error("Invalid signature");
    return { success: false };
  }

  // Try and run the job
  try {
    console.debug(`Running job: ${slug}`);

    const { payload, ...rest } = await req.json();

    await job.handler({ input: payload, metadata: rest });
  } catch (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true };
}

export const buildRequestHandler =
  <TRouter extends JobRouter>(
    opts: RouteHandlerOptions<TRouter>,
  ): RequestHandler =>
  (input) =>
    parseAndValidateRequest(opts, input);

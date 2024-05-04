import { getSecretKey } from "./get-secret-key";
import { JobRouter, RequestHandlerInput, RouteHandlerOptions } from "./types";

export const parseAndValidateRequest = async (
  opts: RouteHandlerOptions<JobRouter>,
  input: RequestHandlerInput,
) => {
  const req = input.req;
  // Get fields off the request
  const url = new URL(req.url);
  const headers = req.headers;
  const params = url.searchParams;
  const slug = params.get("slug");
  const signature = headers.get("X-Queuebase-Signature");
  // TODO: Use to rate limit requests
  const timestamp = headers.get("X-Queuebase-Timestamp");
  const secretKey = getSecretKey();

  if (!slug) {
    throw new Error("Slug not found");
  }

  if (slug && typeof slug !== "string") {
    const msg = `Expected slug to be of type 'string', got '${typeof slug}'`;
    throw new Error(msg);
  }

  if (!signature) {
    throw new Error("Signature not found");
  }

  if (!secretKey) {
    throw new Error("Secret key not found");
  }

  if (!secretKey.startsWith("sk_")) {
    throw new Error("Invalid secret key");
  }

  // Get job from router
  const job = opts.router[slug];

  if (!job) {
    throw new Error(`Job not found for slug: ${slug}`);
  }

  return {
    req,
    slug,
    job,
    secretKey,
  };
};

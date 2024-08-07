import { QueuebaseApiClient } from "../api";
import { Logger } from "../logger";
import { verifySignature } from "./crypto";
import {
  JobRouter,
  RequestHandler,
  RequestHandlerInput,
  RouteHandlerOptions,
} from "./types";
import { parseAndValidateRequest } from "./validate-request";

const apiClient = new QueuebaseApiClient();

export async function runRequestHandler(
  handler: RequestHandler,
  args: RequestHandlerInput,
) {
  const { slug, job, req, secretKey } = await handler(args);
  const { payload, ...rest } = await req.clone().json();

  // Update the attempt start time and start the timer
  await apiClient.attempts.update(rest.attemptId, {
    startTime: new Date(),
  });
  const logger = new Logger(apiClient, rest.attemptId);

  logger.info(`Beginning execution for job: ${slug}`);

  const start = process.hrtime();

  let success = false;
  try {
    // Validate the request signature
    const validationResult = await verifySignature(
      await req.clone().text(),
      req.headers.get("X-Queuebase-Signature"),
      secretKey,
    );

    if (!validationResult) {
      console.error("Invalid signature");
      throw new Error("Invalid signature");
    }

    // Try and run the job
    await job.handler({ input: payload, logger });

    logger.success("Job executed successfully");

    success = true;
  } catch (error: any) {
    logger.error(`Job failed: ${error.message}`);
  }

  // Calculate the duration and update the attempt
  const end = process.hrtime(start);
  const duration = end[0] * 1000 + end[1] / 1000000;
  await apiClient.attempts.update(rest.attemptId, {
    endTime: new Date(),
    duration: Math.round(duration),
  });

  return { success };
}

export const buildRequestHandler =
  <TRouter extends JobRouter>(
    opts: RouteHandlerOptions<TRouter>,
  ): RequestHandler =>
  (input) =>
    parseAndValidateRequest(opts, input);

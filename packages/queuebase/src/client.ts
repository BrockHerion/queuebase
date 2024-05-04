import { AnyParams, JobRouter } from "./lib/types";
import { QueuebaseApiClient } from "./sdk/api";

function genJobs<TRouter extends JobRouter>(
  apiKey: string,
  queuebaseUrl?: string,
) {
  return <TEndpoint extends keyof TRouter>(endpoint: TEndpoint) => {
    const client = new QueuebaseApiClient(apiKey, queuebaseUrl);

    return {
      enqueue: async <TParams extends AnyParams>(
        payload?: TParams["_input"],
      ) => {
        await client.enqueue(endpoint.toString(), payload);
      },
    };
  };
}

export const createQueuebaseClient = <TRouter extends JobRouter>(params: {
  apiKey: string;
  queuebaseUrl?: string;
}) => {
  return {
    jobs: genJobs<TRouter>(params.apiKey, params.queuebaseUrl),
  } as const;
};
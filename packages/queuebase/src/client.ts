import { EnqueueConfig, JobRouter, UnsetMarker } from "./lib/types";
import { QueuebaseApiClient } from "./sdk/api";

function genJobs<TRouter extends JobRouter>(apiKey?: string) {
  return <TEndpoint extends keyof TRouter>(endpoint: TEndpoint) => {
    const client = new QueuebaseApiClient(apiKey);

    type Payload = TRouter[TEndpoint]["input"] extends UnsetMarker
      ? undefined
      : TRouter[TEndpoint]["input"];

    return {
      enqueue: async (
        payload?: Exclude<Payload, undefined>,
        config?: EnqueueConfig,
      ) => {
        await client.jobs.enqueue(endpoint.toString(), payload, config);
      },
    };
  };
}

export const createQueuebaseClient = <TRouter extends JobRouter>(params?: {
  apiKey?: string;
}) => {
  return {
    jobs: genJobs<TRouter>(params?.apiKey),
  } as const;
};

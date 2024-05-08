import { process } from "std-env";
import { getApiKeyOrThrow } from "../../lib/get-api-key";
import { AttemptsClient } from "./attempts";
import { JobsClient } from "./jobs";

export class QueuebaseApiClient {
  public attempts: AttemptsClient;
  public jobs: JobsClient;

  constructor(publicKey?: string) {
    const apiKey = publicKey || getApiKeyOrThrow();

    const queuebaseUrl = process.env.NEXT_PUBLIC_QUEUEBASE_APP_URL;

    this.attempts = new AttemptsClient(apiKey, queuebaseUrl);
    this.jobs = new JobsClient(apiKey, queuebaseUrl);
  }
}

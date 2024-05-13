import { AnyParams, EnqueueConfig } from "../../lib/types";
import { BaseClient } from "./base-client";

export class JobsClient extends BaseClient {
  constructor(publicKey: string, queuebaseUrl?: string) {
    super(publicKey, queuebaseUrl);
  }

  // TODO: Return a queued job with status, cancel, and retry methods
  async enqueue<TParams extends AnyParams>(
    name: string,
    payload?: TParams["_input"],
    config?: EnqueueConfig,
  ): Promise<void> {
    const options: Record<string, string> = {
      method: "POST",
    };

    options.body = JSON.stringify({
      name,
      payload,
      config,
    });

    try {
      const result = await fetch(`${this._queuebaseUrl}/jobs`, {
        ...options,
        headers: {
          Authorization: `Bearer ${this._publicKey}`,
          "Content-Type": "application/json",
        },
      });
      const body = await result.json();

      return body;
    } catch (error) {
      console.error(error);
    }
  }
}

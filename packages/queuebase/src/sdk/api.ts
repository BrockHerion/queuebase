import { AnyParams } from "queuebase/lib/types";

export class QueuebaseApiClient {
  private readonly _publicKey: string;
  private readonly _queuebaseUrl: string;

  constructor(publicKey: string, queuebaseUrl?: string) {
    this._publicKey = publicKey;
    this._queuebaseUrl = queuebaseUrl ?? "https://queuebase.com/api/v1";
  }

  // TODO: Return a queued job with status, cancel, and retry methods
  public async enqueue<TParams extends AnyParams>(
    name: string,
    payload?: TParams["_input"],
  ): Promise<void> {
    const options: Record<string, string> = {
      method: "POST",
    };

    options.body = JSON.stringify({
      name,
      payload,
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

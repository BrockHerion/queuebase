import { BaseClient } from "./base-client";

export class AttemptsClient extends BaseClient {
  constructor(publicKey: string, queuebaseUrl?: string) {
    super(publicKey, queuebaseUrl);
  }

  async update(
    attemptId: string,
    params: {
      startTime?: Date;
      endTime?: Date;
      duration?: number;
    },
  ) {
    try {
      await fetch(`${this._queuebaseUrl}/attempts/${attemptId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this._publicKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateStatus(attemptId: string, status: string) {
    try {
      await fetch(`${this._queuebaseUrl}/attempts/${attemptId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this._publicKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async log(
    attemptId: string,
    level: string,
    message: string,
    timestamp: Date,
  ) {
    try {
      await fetch(`${this._queuebaseUrl}/attempts/${attemptId}/logs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this._publicKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          level,
          timestamp,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }
}

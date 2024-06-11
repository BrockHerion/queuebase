import { QueuebaseApiClient } from "./api";

export abstract class QueuebaseLogger {
  protected _apiClient: QueuebaseApiClient;
  protected _attemptId: string;

  constructor(apiClient: QueuebaseApiClient, attemptId: string) {
    this._apiClient = apiClient;
    this._attemptId = attemptId;
  }

  abstract info(message: string): void;
  abstract error(message: string): void;
  abstract warn(message: string): void;
  abstract debug(message: string): void;
  abstract fatal(message: string): void;
  abstract trace(message: string): void;
  abstract success(message: string): void;
}

/**
 * All the public log levels users can set.
 */
export type LogLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace"
  | "success";

const colorize = (str: string, level: LogLevel) => {
  // TODO: Maybe check is shell supports colors

  switch (level) {
    case "error":
    case "fatal":
      return `\x1b[31m${str}\x1b[0m`;
    case "warn":
      return `\x1b[33m${str}\x1b[0m`;
    case "info":
      return `\x1b[34m${str}\x1b[0m`;
    case "debug":
      return `\x1b[37m${str}\x1b[0m`;
    case "trace":
      return `\x1b[37m${str}\x1b[0m`;
    case "success":
      return `\x1b[32m${str}\x1b[0m`;
    default:
      return str;
  }
};

const icons: { [t in LogLevel]?: string } = {
  fatal: "⨯",
  error: "⨯",
  warn: "⚠️",
  info: "ℹ",
  debug: "⚙",
  trace: "→",
  success: "✓",
};

export class Logger extends QueuebaseLogger {
  constructor(apiClient: QueuebaseApiClient, attemptId: string) {
    super(apiClient, attemptId);
  }

  info(message: string): void {
    const formattedMessage = `${colorize(`${icons.info}`, "info")} ${message}`;
    console.log(formattedMessage);

    const timestamp = new Date();

    this._apiClient.attempts
      .log(this._attemptId, "info", message, timestamp)
      .catch((error) => {
        console.error(error);
      });
  }
  error(message: string): void {
    const formattedMessage = `${colorize(`${icons.error}`, "error")} ${message}`;
    console.log(formattedMessage);

    const timestamp = new Date();

    this._apiClient.attempts
      .log(this._attemptId, "error", message, timestamp)
      .catch((error) => {
        console.error(error);
      });
  }
  warn(message: string): void {
    const formattedMessage = `${colorize(`${icons.trace}`, "warn")} ${message}`;
    console.log(formattedMessage);

    const timestamp = new Date();

    this._apiClient.attempts
      .log(this._attemptId, "warn", message, timestamp)
      .catch((error) => {
        console.error(error);
      });
  }
  debug(message: string): void {
    const formattedMessage = `${colorize(`${icons.trace}`, "debug")} ${message}`;
    console.log(formattedMessage);

    const timestamp = new Date();

    this._apiClient.attempts
      .log(this._attemptId, "debug", message, timestamp)
      .catch((error) => {
        console.error(error);
      });
  }
  fatal(message: string): void {
    const formattedMessage = `${colorize(`${icons.trace}`, "fatal")} ${message}`;
    console.log(formattedMessage);

    const timestamp = new Date();

    this._apiClient.attempts
      .log(this._attemptId, "fatal", message, timestamp)
      .catch((error) => {
        console.error(error);
      });
  }
  trace(message: string): void {
    const formattedMessage = `${colorize(`${icons.trace}`, "trace")} ${message}`;
    console.log(formattedMessage);

    const timestamp = new Date();

    this._apiClient.attempts
      .log(this._attemptId, "trace", message, timestamp)
      .catch((error) => {
        console.error(error);
      });
  }
  success(message: string): void {
    const formattedMessage = `${colorize(`${icons.success}`, "success")} ${message}`;
    console.log(formattedMessage);

    const timestamp = new Date();

    this._apiClient.attempts
      .log(this._attemptId, "success", message, timestamp)
      .catch((error) => {
        console.error(error);
      });
  }
}

import { Logger } from "./logger";
import { JsonParser } from "./parser";

export type MaybePromise<T> = T | Promise<T>;

export type JsonValue = string | number | boolean | null | undefined;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue | JsonObject | JsonArray };
export type Json = JsonValue | JsonObject | JsonArray;

export type ErrorMessage<TError extends string> = TError;

export type Simplify<TType> = { [TKey in keyof TType]: TType[TKey] } & {};

export type JobData = {
  jobId: string;
  runId: string;
  envId: string;
  attemptId: string;
  name: string;
};

const unsetMarker = "unsetMarker" as "unsetMarker" & {
  __brand: "unsetMarker";
};
export type UnsetMarker = typeof unsetMarker;

type ResolverOptions<TParams extends AnyParams> = {
  input: TParams["_input"];
  logger: Logger;
};

type HandlerFn<TOutput extends Json | void, TParams extends AnyParams> = (
  opts: ResolverOptions<TParams>,
) => MaybePromise<TOutput>;

export type AnyParams = {
  _input: any;
  _output: any;
  _config: any;
};

export type JobConfig = {
  retries?: number;
  friendlyName?: string;
  description?: string;
};

export interface JobBuilder<TParams extends AnyParams> {
  input: <TParser extends JsonParser>(
    parser: TParams["_input"] extends UnsetMarker
      ? TParser
      : ErrorMessage<"Input is already in use">,
  ) => JobBuilder<{
    _input: TParser["_output"];
    _output: UnsetMarker;
    _config: TParams["_config"];
  }>;
  config: <TConfig extends JobConfig>(
    config: TParams["_config"] extends UnsetMarker
      ? TConfig
      : ErrorMessage<"Config is already in use">,
  ) => JobBuilder<{
    _input: TParams["_input"];
    _output: TParams["_output"];
    _config: TConfig;
  }>;
  handler: <TOutput extends Json | void>(
    fn: HandlerFn<TOutput, TParams>,
  ) => Job<{
    _input: TParams["_input"];
    _output: TOutput;
    _config: TParams["_config"];
  }>;
}

export type JobBuilderDef<TParams extends AnyParams> = {
  inputParser: JsonParser;
  config: JobConfig;
};

export interface Job<TParams extends AnyParams> {
  _def: TParams & JobBuilderDef<TParams>;
  input: TParams["_input"];
  handler: HandlerFn<TParams["_output"], TParams>;
}

export type AnyJob = Job<AnyParams>;

export type JobRouter<TParams extends AnyParams = AnyParams> = Record<
  string,
  Job<TParams>
>;

export type RouteHandlerOptions<TRouter extends JobRouter> = {
  router: TRouter;
};

export type RequestHandlerInput = { req: Request };

export type RequestHandler = (
  input: RequestHandlerInput,
) => Promise<RequestInput>;

export type RequestInput = {
  req: Request;
  slug: string;
  job: Job<AnyParams>;
  secretKey: string;
};

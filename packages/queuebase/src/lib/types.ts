import { JsonParser } from "./parser";

export type MaybePromise<T> = T | Promise<T>;

export type JsonValue = string | number | boolean | null | undefined;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue | JsonObject | JsonArray };
export type Json = JsonValue | JsonObject | JsonArray;

export type ErrorMessage<TError extends string> = TError;

export type Simplify<TType> = { [TKey in keyof TType]: TType[TKey] } & {};

const unsetMarker = "unsetMarker" as "unsetMarker" & {
  __brand: "unsetMarker";
};
export type UnsetMarker = typeof unsetMarker;

export type ValidHandlerObject = {
  [key: string]: unknown;
} | void;

type ResolverOptions<TParams extends AnyParams> = {
  metadata: Simplify<
    TParams["_metadata"] extends UnsetMarker ? undefined : TParams["_metadata"]
  >;
  input: TParams["_input"];
};

type HandlerFn<TOutput extends Json | void, TParams extends AnyParams> = (
  opts: ResolverOptions<TParams>,
) => MaybePromise<TOutput>;

export type AnyParams = {
  _input: any;
  _metadata: any; // imaginary field used to bind metadata return type to a job resolver
  _output: any;
};

export interface JobBuilder<TParams extends AnyParams> {
  input: <TParser extends JsonParser>(
    parser: TParams["_input"] extends UnsetMarker
      ? TParser
      : ErrorMessage<"Input is already in use">,
  ) => JobBuilder<{
    _input: TParser["_output"];
    _metadata: TParams["_metadata"];
    _output: UnsetMarker;
  }>;
  handler: <TOutput extends Json | void>(
    fn: HandlerFn<TOutput, TParams>,
  ) => Job<{
    _input: TParams["_input"];
    _metadata: TParams["_metadata"];
    _output: TOutput;
  }>;
}

export type JobBuilderDef<TParams extends AnyParams> = {
  inputParser: JsonParser;
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

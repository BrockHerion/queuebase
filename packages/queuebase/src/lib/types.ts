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
};

export type HandlerFnArgs<TRequest, TResponse> = {
  req: TRequest;
  res: TResponse;
};

type HandlerFn<
  TInput extends Json | UnsetMarker,
  TOutput extends ValidHandlerObject,
  TArgs extends HandlerFnArgs<any, any>,
> = (
  opts: TArgs & {
    input: TInput extends UnsetMarker ? undefined : TInput;
  },
) => MaybePromise<TOutput>;

type ResolverFn<TOutput extends Json | void, TParams extends AnyParams> = (
  opts: ResolverOptions<TParams>,
) => MaybePromise<TOutput>;

export type AnyParams = {
  _input: any;
  _metadata: any; // imaginary field used to bind metadata return type to a job resolver
  _output: any;
  _handlerArgs: any;
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
    _handlerArgs: TParams["_handlerArgs"];
  }>;
  handler: <TOutput extends ValidHandlerObject>(
    fn: TParams["_metadata"] extends UnsetMarker
      ? HandlerFn<TParams["_input"], TOutput, TParams["_metadata"]>
      : ErrorMessage<"Handler is already set">,
  ) => JobBuilder<{
    _input: TParams["_input"];
    _metadata: TOutput;
    _output: UnsetMarker;
    _handlerArgs: TParams["_handlerArgs"];
  }>;
}

export type JobBuilderDef<TParams extends AnyParams> = {
  inputParser: JsonParser;
  handler: HandlerFn<TParams["_input"], {} | void, TParams["_handlerArgs"]>;
};

export interface Job<TParams extends AnyParams> {
  _def: TParams & JobBuilderDef<TParams>;
  resolver: ResolverFn<TParams["_output"], TParams>;
}

export type AnyJob = Job<AnyParams>;

export type JobRouter<TParams extends AnyParams = AnyParams> = Record<
  string,
  Job<TParams>
>;

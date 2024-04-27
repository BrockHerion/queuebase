import {
  AnyParams,
  HandlerFnArgs,
  JobBuilder,
  JobBuilderDef,
  UnsetMarker,
} from "./types";

function internalCreateBuilder<THandlerArgs extends HandlerFnArgs<any, any>>(
  initDef: Partial<JobBuilderDef<any>> = {},
): JobBuilder<{
  _input: UnsetMarker;
  _metadata: UnsetMarker;
  _output: UnsetMarker;
  _handlerArgs: THandlerArgs;
}> {
  const _def: JobBuilderDef<AnyParams> = {
    inputParser: {
      parse: () => undefined,
      _input: undefined,
      _output: undefined,
    },

    handler: () => ({}),

    // Overload with properties passed in
    ...initDef,
  };

  return {
    input: (parser) => {
      return internalCreateBuilder({
        ..._def,
        inputParser: parser,
      }) as JobBuilder<any>;
    },
    handler: (fn) => {
      return internalCreateBuilder({
        ..._def,
        handler: fn,
      }) as JobBuilder<any>;
    },
  };
}

type InOut<THandlerArgs extends HandlerFnArgs<any, any>> = () => JobBuilder<{
  _input: UnsetMarker;
  _metadata: UnsetMarker;
  _output: UnsetMarker;
  _handlerArgs: THandlerArgs;
}>;

export function createBuilder<
  THandlerArgs extends HandlerFnArgs<any, any>,
>(): InOut<THandlerArgs> {
  return () => {
    return internalCreateBuilder<THandlerArgs>();
  };
}

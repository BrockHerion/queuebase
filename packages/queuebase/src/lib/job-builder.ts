import {
  AnyParams,
  Job,
  JobBuilder,
  JobBuilderDef,
  UnsetMarker,
} from "./types";

function internalCreateBuilder<THandlerArgs>(
  initDef: Partial<JobBuilderDef<any>> = {},
): JobBuilder<{
  _input: UnsetMarker;
  _output: UnsetMarker;
  _handlerArgs: THandlerArgs;
  _config: UnsetMarker;
}> {
  const _def: JobBuilderDef<AnyParams> = {
    inputParser: {
      parse: () => undefined,
      _input: undefined,
      _output: undefined,
    },

    config: {
      retries: 0,
    },

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
    config: (config) => {
      return internalCreateBuilder({
        ..._def,
        config,
      }) as JobBuilder<any>;
    },
    handler: (fn) => {
      return {
        _def,
        handler: fn,
      } as Job<any>;
    },
  };
}

type InOut<THandlerArgs> = () => JobBuilder<{
  _input: UnsetMarker;
  _output: UnsetMarker;
  _handlerArgs: THandlerArgs;
  _config: UnsetMarker;
}>;

export function createBuilder<THandlerArgs>(): InOut<THandlerArgs> {
  return () => {
    return internalCreateBuilder<THandlerArgs>();
  };
}

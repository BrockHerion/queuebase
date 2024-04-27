import { Json, MaybePromise } from "./types";

export type ParseFn<TType> = (input: unknown) => MaybePromise<TType>;
export type ParserZodEsque<TInput, TParsedInput extends Json> = {
  _input: TInput;
  _output: TParsedInput;
  parse: ParseFn<TParsedInput>;
};

export type JsonParser = ParserZodEsque<Json, Json>;

export function getParseFn<TParser extends JsonParser>(
  parser: TParser,
): ParseFn<TParser["_output"]> {
  if (typeof parser.parse === "function") {
    return parser.parse;
  }

  throw new Error("Invalid parser");
}

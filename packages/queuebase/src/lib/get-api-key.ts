import { process } from "std-env";

export function getApiKey() {
  if (process.env.NEXT_PUBLIC_QUEUEBASE_API_KEY) {
    return process.env.NEXT_PUBLIC_QUEUEBASE_API_KEY;
  }

  return undefined;
}

export function getApiKeyOrThrow() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing or invalid API key");
  }

  return apiKey;
}

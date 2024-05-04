import { process } from "std-env";

export function getSecretKey() {
  if (process.env.QUEUEBASE_SECRET_KEY) {
    return process.env.QUEUEBASE_SECRET_KEY;
  }

  return undefined;
}

export function getSecretKeyOrThrow() {
  const secretKey = getSecretKey();
  if (!secretKey || !secretKey.startsWith("sk_")) {
    throw new Error("Missing or invalid secret key");
  }

  return secretKey;
}

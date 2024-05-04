const signaturePrefix = "hmac-sha256=";
const algorithm = { name: "HMAC", hash: "SHA-256" };

export const verifySignature = async (
  payload: string,
  signature: string | null,
  secret: string,
) => {
  const sig = signature?.slice(signaturePrefix.length);
  if (!sig) return false;

  const encoder = new TextEncoder();
  const signingKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    algorithm,
    false,
    ["verify"],
  );
  return await crypto.subtle.verify(
    algorithm,
    signingKey,
    Uint8Array.from(Buffer.from(sig, "hex")),
    encoder.encode(payload),
  );
};

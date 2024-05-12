import { process } from "std-env";

type RequestLike = {
  method?: string | undefined;
  url?: string | undefined;
  headers?: Record<string, string | string[] | undefined>;
  body?: any;
};

function buildUrl(req: RequestLike) {
  if (!req.url) {
    throw new Error("Missing URL");
  }

  const headers = req.headers;
  let relativeUrl = req.url ?? "/";
  if ("baseUrl" in req && typeof req.baseUrl === "string") {
    relativeUrl = req.baseUrl + relativeUrl;
  }

  const proto = headers?.["x-forwarded-proto"] ?? "http";
  const host = headers?.["x-forwarded-host"] ?? headers?.host;

  if (typeof proto !== "string" || typeof host !== "string") {
    return new URL(relativeUrl, process.env.QUEUEBASE_URL);
  }

  return `${proto}://${host}${relativeUrl}`;
}

export default function toWebRequest(req: RequestLike): Request {
  if (!req.url) {
    throw new Error("Missing URL");
  }

  if (!req.method) {
    throw new Error("Missing method");
  }

  const allowsBody = ["POST", "PUT", "PATCH"].includes(req.method);
  const url = buildUrl(req);

  return new Request(url, {
    method: req.method,
    headers: Object.fromEntries(
      Object.entries(req.headers ?? {}).filter(
        ([, v]) => typeof v === "string",
      ),
    ) as Record<string, string>,
    ...(allowsBody && {
      body: typeof req.body === "string" ? req.body : JSON.stringify(req.body),
    }),
  });
}

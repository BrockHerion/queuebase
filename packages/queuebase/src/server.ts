/** @internal */
export function INTERNAL_DO_NOT_USE_createRouteHandler() {
  const POST = async (request: Request | { request: Request }) => {
    const req = request instanceof Request ? request : request.request;

    console.log("POST", req);

    return new Response(null, { status: 204 });
  };

  return {
    POST,
  };
}

module.exports = (baseUrl, schema) => (request, response) => {
  const parsedUrl = new URL(request.url, baseUrl);
  const params = {};
  const pathParams = parsedUrl.pathname.split("/");
  const index = pathParams.indexOf("person");
  if (pathParams[index + 1]) {
    const personId = pathParams[index + 1];
    params["personId"] = personId;
    // request.pathname = schema
    request.pathname = schema;
    // request.pathParams = { personId: "1232-2312-1231-321A" }
    request.pathParams = params;
  }
};

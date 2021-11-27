module.exports = (baseUrl, schema) => (request) => {
  const parsedUrl = new URL(request.url, baseUrl);
  const params = {};
  const pathParams = parsedUrl.pathname.split("/");

  if (pathParams.length === 3) {
    const index = pathParams.indexOf("person");
    if (pathParams[index + 1]) {
      const personId = pathParams[index + 1];
      params["personId"] = personId;
      request.pathname = schema;
      request.pathParams = params;
    }
  }
};

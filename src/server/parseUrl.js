module.exports = (baseUrl) => (request) => {
  const parsedUrl = new URL(request.url, baseUrl);
  const params = {};
  parsedUrl.searchParams.forEach((value, key) => (params[key] = value));
  request.pathname = parsedUrl.pathname;
  request.params = params;
};

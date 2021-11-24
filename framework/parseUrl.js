module.exports = (baseUrl) => (request, response) => {
  const parsedUrl = new URL(request.url, baseUrl);
  const params = {};
  // console.log(request);
  console.log(parsedUrl);
  parsedUrl.searchParams.forEach((value, key) => (params[key] = value));
  request.pathname = parsedUrl.pathname;
  request.params = params;
};

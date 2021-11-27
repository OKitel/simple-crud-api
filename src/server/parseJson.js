module.exports = (request, response) => {
  response.writeHead(200, {
    "Content-type": "application/json",
  });
  response.send = (data) => {
    response.end(JSON.stringify(data));
  };
};

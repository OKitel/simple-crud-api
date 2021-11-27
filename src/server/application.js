const http = require("http");
const EventEmitter = require("events");

module.exports = class Application {
  constructor() {
    this.emitter = new EventEmitter();
    this.server = this._createServer();
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  addRouter(router) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(
          this._getRouteMask(path, method),
          (request, response) => {
            try {
              const handler = endpoint[method];
              handler(request, response);
            } catch (error) {
              console.error(error);
              response.writeHead(500, {
                "Content-type": "application/json",
              });
              response.end(
                JSON.stringify({ message: "Internal server error" })
              );
            }
          }
        );
      });
    });
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  _createServer() {
    return http.createServer((request, response) => {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk;
      });
      request.on("end", () => {
        try {
          if (body) {
            request.body = JSON.parse(body);
          }
        } catch (error) {
          console.error(error);
          response.writeHead(400, {
            "Content-type": "application/json",
          });
          return response.end(
            JSON.stringify({
              message: `Bad request: invalid body! Error: ${error.message}`,
            })
          );
        }
        try {
          this.middlewares.forEach((middleware) =>
            middleware(request, response)
          );
          const emitted = this.emitter.emit(
            this._getRouteMask(request.pathname, request.method),
            request,
            response
          );
          if (!emitted) {
            response.writeHead(404, {
              "Content-type": "application/json",
            });
            response.end(JSON.stringify({ message: "Not found!" }));
          }
        } catch (error) {
          console.error(error);
          response.writeHead(500, {
            "Content-type": "application/json",
          });
          response.end(JSON.stringify({ message: "Internal server error" }));
        }
      });
    });
  }

  _getRouteMask(path, method) {
    return `[${path}]:[${method}]`;
  }
};

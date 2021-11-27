const Application = require("./server/application");
const personRouter = require("./person-router");
const jsonParser = require("./server/parseJson");
const parseUrl = require("./server/parseUrl");
const parsePathParams = require("./server/parsePathParams");

const PORT = process.env.PORT || 3000;
const application = new Application();

application.use(jsonParser);
application.use(parseUrl(`http://localhost:${PORT}`));
application.use(parsePathParams(`http://localhost:${PORT}`, "/person/:id"));
application.addRouter(personRouter);

module.exports = {
  application,
  PORT,
};

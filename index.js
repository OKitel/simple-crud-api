const Application = require("./framework/application");
const personRouter = require("./src/person-router");
const jsonParser = require("./framework/parseJson");
const parseUrl = require("./framework/parseUrl");

const PORT = process.env.PORT || 3000;
const application = new Application();

application.use(jsonParser);
application.use(parseUrl(`http://localhost:${PORT}`));

application.addRouter(personRouter);
application.listen(PORT, () => console.log(`Server started on port ${PORT}`));

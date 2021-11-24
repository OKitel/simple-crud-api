const Router = require("../framework/router");
const controller = require("./person-controller");
const router = new Router();

router.get("/person", controller.getPersons);

router.post("/person", controller.createPerson);

module.exports = router;

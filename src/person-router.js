const Router = require("../server/router");
const controller = require("./person-controller");
const router = new Router();

router.get("/person", controller.getPersons);

router.get("/person/:id", controller.getOnePerson);

router.post("/person", controller.createPerson);

router.put("/person/:id", controller.updateFullPerson);

router.patch("/person/:id", controller.updatePartPerson);

router.delete("/person/:id", controller.deletePerson);

module.exports = router;

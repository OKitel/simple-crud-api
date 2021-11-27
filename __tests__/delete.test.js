const app = require("../app");
const supertest = require("supertest");
const request = supertest(app.application.server);

const FAKE_ID = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

test("should send 'Not found' message if there is no person with such id DELETE", (done) => {
  request
    .delete(`/person/${FAKE_ID}`)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toEqual(
        `Not found person with id = ${FAKE_ID}`
      );
      done();
    })
    .catch(done);
});

test("should send 'Incorrect id format' message DELETE", (done) => {
  request
    .delete(`/person/${FAKE_ID}1`)
    .expect(400)
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: incorrect id format!"
      );
      done();
    })
    .catch(done);
});

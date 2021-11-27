const app = require("../app");
const supertest = require("supertest");
const request = supertest(app.application.server);

const FAKE_ID = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";
test("should get the person list => empty array", (done) => {
  request
    .get("/person")
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toStrictEqual([]);
      done();
    })
    .catch(done);
});

test("should send 'Not found' message if there is no person with such id GET", (done) => {
  request
    .get(`/person/${FAKE_ID}`)
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toEqual(
        `Not found person with id = ${FAKE_ID}`
      );
      done();
    })
    .catch(done);
});

test("should send 'Incorrect id format' message", (done) => {
  request
    .get(`/person/${FAKE_ID}1`)
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .then((response) => {
      expect(response.body.message).toEqual("Bad request: incorrect id format");
      done();
    })
    .catch(done);
});

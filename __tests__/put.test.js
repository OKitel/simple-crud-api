const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app.application.server);

const FAKE_ID = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

test("should send 'name is required' message when the name wasn't passed for updating person", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then((response) => {
      const personId = response.body.id;
      request
        .put(`/person/${personId}`)
        .send({
          age: 33,
          hobbies: ["painting", "hiking"],
          id: personId,
        })
        .then((response) => {
          expect(response.body.message).toEqual(
            "Bad request: Person name is required and should be a string!"
          );
          request.delete(`/person/${personId}`).then(() => done());
        });
    })
    .catch(done);
});

test("should send 'Hobbies array should contain only strings' message when the hobbies array contains different data types for updating person", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then((response) => {
      const personId = response.body.id;
      request
        .put(`/person/${personId}`)
        .send({
          name: "John",
          age: 33,
          hobbies: ["painting", 33],
          id: personId,
        })
        .then((response) => {
          expect(response.body.message).toEqual(
            "Bad request: Hobbies array should contain only strings!"
          );
          request.delete(`/person/${personId}`).then(() => done());
        });
    })
    .catch(done);
});

test("should send 'Person not found' message for updating person", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then((response) => {
      const personId = response.body.id;
      request
        .put(`/person/${FAKE_ID}`)
        .send({
          name: "John",
          age: 33,
          hobbies: ["painting"],
          id: personId,
        })
        .then((response) => {
          expect(response.statusCode).toBe(404);
          expect(response.body.message).toEqual(
            `Not found person with id = ${FAKE_ID}`
          );
          request.delete(`/person/${personId}`).then(() => done());
        })
        .catch(done);
    })
    .catch(done);
});

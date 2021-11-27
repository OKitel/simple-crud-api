const app = require("../app");
const supertest = require("supertest");
const request = supertest(app.application.server);

const FAKE_ID = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

test("should update part of person's data => PATCH method", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then((response) => {
      const personId = response.body.id;
      request
        .patch(`/person/${personId}`)
        .send({
          name: "John Doe",
        })
        .then((response) => {
          expect(response.body).toEqual({
            name: "John Doe",
            age: 33,
            hobbies: [],
            id: personId,
          });
          request.delete(`/person/${personId}`).then(() => done());
        })
        .catch(done);
    })
    .catch(done);
});

test("should send 'Hobbies array should contain only strings' message when the hobbies array contains different data types for updating person PATCH", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then((response) => {
      const personId = response.body.id;
      request
        .patch(`/person/${personId}`)
        .send({
          hobbies: ["painting", 33],
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

test("should send 'Person age should be more than 0' message when age is less than 0 for updating person PATCH", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then((response) => {
      const personId = response.body.id;
      request
        .patch(`/person/${personId}`)
        .send({
          age: -33,
        })
        .then((response) => {
          expect(response.body.message).toEqual(
            "Bad request: Person age should be more than 0."
          );
          request.delete(`/person/${personId}`).then(() => done());
        });
    })
    .catch(done);
});

test("should send 'Hobbies are required: can be an empty array or an array of strings!' message when age is less than 0 for updating person PATCH", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then((response) => {
      const personId = response.body.id;
      request
        .patch(`/person/${personId}`)
        .send({
          hobbies: {},
        })
        .then((response) => {
          expect(response.body.message).toEqual(
            "Bad request: Hobbies are required: can be an empty array or an array of strings!"
          );
          request.delete(`/person/${personId}`).then(() => done());
        });
    })
    .catch(done);
});

test("should send 'Person not found' message for updating person PATCH", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 33, hobbies: [] })
    .then(() => {
      request
        .patch(`/person/${FAKE_ID}`)
        .send({
          name: "John Doe",
        })
        .then((response) => {
          expect(response.statusCode).toBe(404);
          expect(response.body.message).toEqual(
            `Not found person with id = ${FAKE_ID}`
          );
          done();
        })
        .catch(done);
    })
    .catch(done);
});
test("should send 'Incorrect id format' message PATCH", (done) => {
  request
    .patch(`/person/${FAKE_ID}1`)
    .expect(400)
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: incorrect id format!"
      );
      done();
    })
    .catch(done);
});

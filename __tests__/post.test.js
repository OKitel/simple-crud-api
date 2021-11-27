const app = require("../app");
const supertest = require("supertest");
const request = supertest(app.application.server);

test("should create the person", (done) => {
  request
    .post("/person")
    .send({ name: "John Doe", age: 33, hobbies: [] })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(201)
    .then((response) => {
      const personId = response.body.id;
      expect(response.body).toEqual({
        name: "John Doe",
        age: 33,
        hobbies: [],
        id: personId,
      });
      request.delete(`/person/${personId}`).then(() => done());
    })
    .catch(done);
});

test("should create and delete person", (done) => {
  request
    .post("/person")
    .send({ name: "John Doe", age: 33, hobbies: [] })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(201)
    .then((response) => {
      const personId = response.body.id;
      expect(response.body).toEqual({
        name: "John Doe",
        age: 33,
        hobbies: [],
        id: personId,
      });
      request
        .delete(`/person/${personId}`)
        .expect(204)
        .then(() => done());
    })
    .catch(done);
});

test("should send 'name is required' message when the name wasn't passed for creating person", (done) => {
  request
    .post("/person")
    .send({ age: 33, hobbies: [] })
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: Person name is required and should be a string!"
      );
      done();
    })
    .catch(done);
});

test("should send 'name is required' message when the provided name isn't a string for creating person", (done) => {
  request
    .post("/person")
    .send({ name: 22, age: 33, hobbies: [] })
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: Person name is required and should be a string!"
      );
      done();
    })
    .catch(done);
});

test("should send 'age is required' message when the age wasn't passed for creating person", (done) => {
  request
    .post("/person")
    .send({ name: "John", hobbies: [] })
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: Person age is required and should be a number!"
      );
      done();
    })
    .catch(done);
});

test("should send 'age should be more 0' message when the age is less 0 for creating person", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: -40, hobbies: [] })
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: Person age should be more than 0."
      );
      done();
    })
    .catch(done);
});

test("should send 'hobbies is required' message when the hobbies array wasn't passed for creating person", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 22 })
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: Hobbies are required: can be an empty array or an array of strings!"
      );
      done();
    })
    .catch(done);
});

test("should send 'Hobbies array should contain only strings' message when the hobbies array contains different data types for creating person", (done) => {
  request
    .post("/person")
    .send({ name: "John", age: 22, hobbies: ["socker", 2, null] })
    .then((response) => {
      expect(response.body.message).toEqual(
        "Bad request: Hobbies array should contain only strings!"
      );
      done();
    })
    .catch(done);
});

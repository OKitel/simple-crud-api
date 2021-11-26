const app = require("../app");
const supertest = require("supertest");
const request = supertest(app.application.server);

it("gets the person endpoint", (done) => {
  request
    .get("/person")
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toStrictEqual([]);
      done();
    })
    .catch((err) => done(err));
});

it("create the person", (done) => {
  request
    .post("/person")
    .send({ name: "John Doe", age: 33, hobbies: [] })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(201)
    .then((response) => {
      const personId = response.body.id;
      expect(response.body).toEqual(
        expect.objectContaining({
          name: "John Doe",
          age: 33,
          hobbies: [],
        })
      );
      request.delete(`/person/${personId}`).then(() => done());
    })
    .catch((err) => done(err));
});

it("E2E scenario #1", (done) => {
  request
    .get("/person")
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((response) => {
      expect(response.body).toStrictEqual([]);
      request
        .post("/person")
        .send({ name: "John Doe", age: 33, hobbies: [] })
        .then((response) => {
          const personId = response.body.id;
          expect(response.body).toEqual(
            expect.objectContaining({
              name: "John Doe",
              age: 33,
              hobbies: [],
            })
          );
          request
            .get(`/person/${personId}`)
            .then((response) => {
              expect(response.body).toEqual(
                expect.objectContaining({
                  name: "John Doe",
                  age: 33,
                  hobbies: [],
                })
              );
              request
                .put(`/person/${personId}`)
                .send({
                  name: "John Doe",
                  age: 33,
                  hobbies: ["playing piano", "horse riding"],
                })
                .then((response) => {
                  expect(response.body).toEqual(
                    expect.objectContaining({
                      name: "John Doe",
                      age: 33,
                      hobbies: ["playing piano", "horse riding"],
                    })
                  );

                  request
                    .delete(`/person/${personId}`)
                    .expect(204)
                    .then(() => {
                      request
                        .get(`/person/${personId}`)
                        .then((response) => {
                          expect(response.body.message).toEqual(
                            `Not found person with id = ${personId}`
                          );
                          done();
                        })
                        .catch(done);
                    })
                    .catch(done);
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    })
    .catch(done);
});

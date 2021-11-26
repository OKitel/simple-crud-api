const app = require("../app");
const supertest = require("supertest");
const request = supertest(app.application.server);

test("gets the person endpoint", (done) => {
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

test("create the person", (done) => {
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

test("E2E scenario #1: GET>POST>GET>PUT>DELETE>GET", (done) => {
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
                  id: personId,
                })
              );
              request
                .put(`/person/${personId}`)
                .send({
                  name: "John Doe",
                  age: 33,
                  hobbies: ["playing piano", "horse riding"],
                  id: personId,
                })
                .then((response) => {
                  expect(response.body).toEqual(
                    expect.objectContaining({
                      name: "John Doe",
                      age: 33,
                      hobbies: ["playing piano", "horse riding"],
                      id: personId,
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

test("E2E scenario #2: POST>GET>PUT>GET>PUT>GET>DELETE>GET", (done) => {
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
          id: personId,
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
              id: personId,
            })
          );
          request
            .put(`/person/${personId}`)
            .send({
              name: "John Doe",
              age: 33,
              hobbies: ["playing piano", "horse riding"],
              id: personId,
            })
            .then((response) => {
              expect(response.body).toEqual(
                expect.objectContaining({
                  name: "John Doe",
                  age: 33,
                  hobbies: ["playing piano", "horse riding"],
                  id: personId,
                })
              );
              request
                .get(`/person/${personId}`)
                .then((response) => {
                  expect(response.body).toEqual(
                    expect.objectContaining({
                      name: "John Doe",
                      age: 33,
                      hobbies: ["playing piano", "horse riding"],
                      id: personId,
                    })
                  );
                  request
                    .put(`/person/${personId}`)
                    .send({
                      name: "John Doe",
                      age: 34,
                      hobbies: ["playing piano", "horse riding", "walking"],
                      id: personId,
                    })
                    .then((response) => {
                      expect(response.body).toEqual(
                        expect.objectContaining({
                          name: "John Doe",
                          age: 34,
                          hobbies: ["playing piano", "horse riding", "walking"],
                          id: personId,
                        })
                      );
                      request
                        .get(`/person/${personId}`)
                        .then((response) => {
                          expect(response.body).toEqual(
                            expect.objectContaining({
                              name: "John Doe",
                              age: 34,
                              hobbies: [
                                "playing piano",
                                "horse riding",
                                "walking",
                              ],
                              id: personId,
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
        })
        .catch(done);
    })
    .catch(done);
});

test("E2E scenario #3: POST>GET>PUT>GET>POST>GET>DELETE>GET", (done) => {
  request
    .post("/person")
    .send({ name: "Jane Smith", age: 24, hobbies: ["painting"] })
    .then((response) => {
      const personId = response.body.id;
      expect(response.body).toEqual({
        name: "Jane Smith",
        age: 24,
        hobbies: ["painting"],
        id: personId,
      });
      request
        .get(`/person/${personId}`)
        .then((response) => {
          expect(response.body).toEqual({
            name: "Jane Smith",
            age: 24,
            hobbies: ["painting"],
            id: personId,
          });
          request
            .put(`/person/${personId}`)
            .send({
              name: "Jane Smith-Doe",
              age: 24,
              hobbies: ["painting", "hiking"],
              id: personId,
            })
            .then((response) => {
              expect(response.body).toEqual({
                name: "Jane Smith-Doe",
                age: 24,
                hobbies: ["painting", "hiking"],
                id: personId,
              });
              request
                .get(`/person/${personId}`)
                .then((response) => {
                  expect(response.body).toEqual({
                    name: "Jane Smith-Doe",
                    age: 24,
                    hobbies: ["painting", "hiking"],
                    id: personId,
                  });
                  request
                    .post("/person")
                    .send({
                      name: "Abraham Lincoln",
                      age: 55,
                      hobbies: ["political hobbyism"],
                    })
                    .then((response) => {
                      const person2Id = response.body.id;
                      expect(response.body).toEqual({
                        name: "Abraham Lincoln",
                        age: 55,
                        hobbies: ["political hobbyism"],
                        id: person2Id,
                      });
                      request
                        .get("/person")
                        .then((response) => {
                          expect(response.body).toEqual([
                            {
                              name: "Jane Smith-Doe",
                              age: 24,
                              hobbies: ["painting", "hiking"],
                              id: personId,
                            },
                            {
                              name: "Abraham Lincoln",
                              age: 55,
                              hobbies: ["political hobbyism"],
                              id: person2Id,
                            },
                          ]);
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
        })
        .catch(done);
    })
    .catch(done);
});

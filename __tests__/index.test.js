const app = require("../app");
const supertest = require("supertest");
const request = supertest(app.application.server);

const FAKE_ID = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

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
          expect(response.body).toEqual({
            name: "John Doe",
            age: 33,
            hobbies: [],
            id: personId,
          });
          request
            .get(`/person/${personId}`)
            .then((response) => {
              expect(response.body).toEqual({
                name: "John Doe",
                age: 33,
                hobbies: [],
                id: personId,
              });
              request
                .put(`/person/${personId}`)
                .send({
                  name: "John Doe",
                  age: 33,
                  hobbies: ["playing piano", "horse riding"],
                  id: personId,
                })
                .then((response) => {
                  expect(response.body).toEqual({
                    name: "John Doe",
                    age: 33,
                    hobbies: ["playing piano", "horse riding"],
                    id: personId,
                  });
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
      expect(response.body).toEqual({
        name: "John Doe",
        age: 33,
        hobbies: [],
        id: personId,
      });
      request
        .get(`/person/${personId}`)
        .then((response) => {
          expect(response.body).toEqual({
            name: "John Doe",
            age: 33,
            hobbies: [],
            id: personId,
          });
          request
            .put(`/person/${personId}`)
            .send({
              name: "John Doe",
              age: 33,
              hobbies: ["playing piano", "horse riding"],
              id: personId,
            })
            .then((response) => {
              expect(response.body).toEqual({
                name: "John Doe",
                age: 33,
                hobbies: ["playing piano", "horse riding"],
                id: personId,
              });
              request
                .get(`/person/${personId}`)
                .then((response) => {
                  expect(response.body).toEqual({
                    name: "John Doe",
                    age: 33,
                    hobbies: ["playing piano", "horse riding"],
                    id: personId,
                  });
                  request
                    .put(`/person/${personId}`)
                    .send({
                      name: "John Doe",
                      age: 34,
                      hobbies: ["playing piano", "horse riding", "walking"],
                      id: personId,
                    })
                    .then((response) => {
                      expect(response.body).toEqual({
                        name: "John Doe",
                        age: 34,
                        hobbies: ["playing piano", "horse riding", "walking"],
                        id: personId,
                      });
                      request
                        .get(`/person/${personId}`)
                        .then((response) => {
                          expect(response.body).toEqual({
                            name: "John Doe",
                            age: 34,
                            hobbies: [
                              "playing piano",
                              "horse riding",
                              "walking",
                            ],
                            id: personId,
                          });
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
                                  request
                                    .delete(`/person/${person2Id}`)
                                    .then(() => done());
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

test("E2E scenario #4: GET>POST>GET>PATCH>DELETE>GET", (done) => {
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
          expect(response.body).toEqual({
            name: "John Doe",
            age: 33,
            hobbies: [],
            id: personId,
          });
          request
            .get(`/person/${personId}`)
            .then((response) => {
              expect(response.body).toEqual({
                name: "John Doe",
                age: 33,
                hobbies: [],
                id: personId,
              });
              request
                .patch(`/person/${personId}`)
                .send({
                  hobbies: ["playing piano", "horse riding"],
                })
                .then((response) => {
                  expect(response.body).toEqual({
                    name: "John Doe",
                    age: 33,
                    hobbies: ["playing piano", "horse riding"],
                    id: personId,
                  });
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

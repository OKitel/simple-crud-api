const { v4: uuidv4 } = require("uuid");
const persons = [];

const UUID_MATCHER =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const badRequestResponse = (response, message) => {
  response.writeHead(400, {
    "Content-type": "application/json",
  });
  return response.end(JSON.stringify({ message: `Bad request: ${message}` }));
};

const getPersons = (request, response) => {
  response.send(persons);
};

const getOnePerson = (request, response) => {
  const personId = request.pathParams.personId;
  if (personId) {
    if (personId.match(UUID_MATCHER)) {
      const person = persons.find(
        (person) => person.id == request.pathParams.personId
      );
      if (!person) {
        response.writeHead(404, {
          "Content-type": "application/json",
        });
        return response.end(
          JSON.stringify({ message: `Not found person with id = ${personId}` })
        );
      }
      return response.send(person);
    } else {
      return badRequestResponse(response, "incorrect id format");
    }
  }
};

const createPerson = (request, response) => {
  const person = request.body;

  person.id = uuidv4();

  if (typeof person.name !== "string") {
    return badRequestResponse(
      response,
      "Person name is required and should be a string!"
    );
  }

  if (typeof person.age !== "number") {
    return badRequestResponse(
      response,
      "Person age is required and should be a number!"
    );
  }

  if (!Array.isArray(person.hobbies)) {
    return badRequestResponse(
      response,
      "Hobbies are required: can be an empty array or an array of strings!"
    );
  }

  if (!person.hobbies.every((item) => typeof item === "string")) {
    return badRequestResponse(
      response,
      "Hobbies array should contain only strings!"
    );
  }

  persons.push(person);
  response.writeHead(201, {
    "Content-type": "application/json",
  });
  response.send(person);
};

const updateFullPerson = (request, response) => {
  const personId = request.pathParams.personId;
  if (personId) {
    if (personId.match(UUID_MATCHER)) {
      const updatedPerson = request.body;
      updatedPerson.id = personId;
      const person = persons.find((person) => person.id == personId);
      const personIndex = persons.indexOf(person);
      if (personIndex === -1) {
        response.writeHead(404, {
          "Content-type": "application/json",
        });
        return response.end(
          JSON.stringify({ message: `Not found person with id = ${personId}` })
        );
      }
      persons.splice(personIndex, 1, updatedPerson);
      return response.send(updatedPerson);
    } else {
      return badRequestResponse(response, "incorrect id format!");
    }
  }
};

const updatePartPerson = (request, response) => {
  const personId = request.pathParams.personId;
  if (personId) {
    if (personId.match(UUID_MATCHER)) {
      const updatedPerson = request.body;
      updatedPerson.id = personId;
      const person = persons.find((person) => person.id == personId);
      const mergedPerson = { ...person, ...updatedPerson };
      const personIndex = persons.indexOf(person);
      if (personIndex === -1) {
        response.writeHead(404, {
          "Content-type": "application/json",
        });
        return response.end(
          JSON.stringify({ message: `Not found person with id = ${personId}` })
        );
      }
      persons.splice(personIndex, 1, mergedPerson);
      return response.send(mergedPerson);
    } else {
      return badRequestResponse(response, "incorrect id format!");
    }
  }
};

const deletePerson = (request, response) => {
  const personId = request.pathParams.personId;
  if (personId) {
    if (personId.match(UUID_MATCHER)) {
      const person = persons.find((person) => person.id == personId);
      const personIndex = persons.indexOf(person);
      if (personIndex === -1) {
        response.writeHead(404, {
          "Content-type": "application/json",
        });
        return response.end(
          JSON.stringify({ message: `Not found person with id = ${personId}` })
        );
      }
      persons.splice(personIndex, 1);
      response.writeHead(204, `The person was successfully deleted`, {
        "Content-type": "application/json",
      });
      return response.end();
    } else {
      return badRequestResponse(response, "incorrect id format!");
    }
  }
};
module.exports = {
  getPersons,
  createPerson,
  getOnePerson,
  deletePerson,
  updateFullPerson,
  updatePartPerson,
};

const { v4: uuidv4 } = require("uuid");
const persons = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "John" },
];

const getPersons = (request, response) => {
  if (request.params.id) {
    return response.send(
      persons.find((person) => person.id == request.params.id)
    );
  }
  response.send(persons);
};

const getOnePerson = (request, response) => {
  if (request.pathParams.personId) {
    return response.send(
      persons.find((person) => person.id == request.pathParams.personId)
    );
  }
  response.send(persons);
};

const createPerson = (request, response) => {
  const person = request.body;
  person.id = uuidv4();
  persons.push(person);
  response.send(person);
};

const updateFullPerson = (request, response) => {
  const personId = request.pathParams.personId;
  if (personId) {
    if (
      personId.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      )
    ) {
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
      response.writeHead(400, {
        "Content-type": "application/json",
      });
      response.end(
        JSON.stringify({ message: "Bad request: incorrect id format!" })
      );
    }
  }
};

const updatePartPerson = (request, response) => {
  const personId = request.pathParams.personId;
  if (personId) {
    if (
      personId.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      )
    ) {
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
      response.writeHead(400, {
        "Content-type": "application/json",
      });
      response.end(
        JSON.stringify({ message: "Bad request: incorrect id format!" })
      );
    }
  }
};

const deletePerson = (request, response) => {
  const personId = request.pathParams.personId;
  if (personId) {
    if (
      personId.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      )
    ) {
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
      response.writeHead(400, {
        "Content-type": "application/json",
      });
      response.end(
        JSON.stringify({ message: "Bad request: incorrect id format!" })
      );
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

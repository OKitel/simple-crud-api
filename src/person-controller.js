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
  //TODO
  const person = request.body;
  persons.push(person);
  response.send(person);
};

const updatePartPerson = (request, response) => {
  //TODO
  const person = request.body;
  persons.push(person);
  response.send(person);
};

const deletePerson = (request, response) => {
  //TODO
  const person = request.body;
  persons.push(person);
  response.send(person);
};
module.exports = {
  getPersons,
  createPerson,
  getOnePerson,
  deletePerson,
  updateFullPerson,
  updatePartPerson,
};

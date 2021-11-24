const persons = [
  { id: 1, name: "Inan" },
  { id: 2, name: "Dima" },
];

const getPersons = (request, response) => {
  if (request.params.id) {
    return response.send(
      persons.find((person) => person.id == request.params.id)
    );
  }
  response.send(persons);
};

const createPerson = (request, response) => {
  const person = request.body;
  persons.push(person);

  response.send(person);
};

module.exports = {
  getPersons,
  createPerson,
};

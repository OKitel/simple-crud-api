# simple-crud-api

### Simple CRUD API for working with persons in the in-memory database

This API supports all standard methods:

- **GET** `/person` or `/person/${personId}` return all persons or person with corresponding `personId`
- **POST** `/person` is used to create record about new person and store it in database
- **PUT** `/person/${personId}` is used to update full record about existing person
- **PATCH** `/person/${personId}` is used to update part of the record about the existing person
- **DELETE** `/person/${personId}` is used to delete record about existing person from database

Persons are stored as `objects` that have following properties:

- `id` — unique identifier (`string`) which is generated on server side.
  This ID is in UUID v4 format
  **ID example:** `'1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'`
- `name` — person's name (`string`, **required**)
- `age` — person's age (`number`, **required**, positive)
- `hobbies` — person's hobbies (`array` of `strings` or empty `array`, **required**)

## To launch API you need:

1. clone this [repo](https://github.com/OKitel/simple-crud-api.git) to your PC
1. download [node.js](https://nodejs.org/en/)
1. download all dependencies into the project root directory

```bash
$ npm i
```

4. using terminal start server

**Development mode** using _nodemon_

```bash
$ npm run start:dev
```

**Production mode** using _webpack_

```bash
$ npm run start:prod
```

Value of port on which application is running is stored in **.env** file. You may change this value anytime.

```
PORT=3030
```

To test all cases you may use postman requests collection, which is located inside the postman directory: [simple-crud-api.postman_collection.json](./postman/simple-crud-api.postman_collection.json)

![Ciphering CLI tool](./assets/postman-icon.png)

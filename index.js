const app = require("./app");

app.application.listen(app.PORT, () =>
  console.log(`Server started on port ${app.PORT}`)
);

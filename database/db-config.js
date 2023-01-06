const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true
  })
  .then(function () {
    console.log("Successfully connected to the Database.");
  })
  .catch(function (e) {
    console.log("Failed to connect to Database");
    console.log(e);
  });

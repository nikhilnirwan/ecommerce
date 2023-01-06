const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
State Schema
------------------
*/

var stateSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  added_on: {
    type: String,
    required: true,
  },
});

stateSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("Name").messages({
      "any.required": "State name should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("State", stateSchema);

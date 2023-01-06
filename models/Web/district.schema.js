const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Product Schema
------------------
*/

var districtSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "State",
  },
  added_on: {
    type: String,
    required: true,
  },
});

districtSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("District").messages({
      "any.required": "District name should not be empty!",
    }),
    state: Joi.string().required().label("State").messages({
      "any.required": "State ID should not be empty!",
      "String.empty": "State ID should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("District", districtSchema);

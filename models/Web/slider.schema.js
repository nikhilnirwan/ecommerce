const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Slider Schema
------------------
*/

var sliderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  added_on: {
    type: String,
    required: true,
  },
});

sliderSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("Name").messages({
      "any.required": "Slider title should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Slider", sliderSchema);

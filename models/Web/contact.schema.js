const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Category Schema
------------------
*/

var contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { 
    type: String,
  },
  message: {
    type: String,
    required: true,
  }, 
  date_time: {
    type: String,
    required: true,
  }
});
   
contactSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("Name").messages({
      "any.required": "Name should not be empty!",
    }),
	email: Joi.string().required().label("Email").messages({
      "any.required": "Email should not be empty!",
    }),
	message: Joi.string().required().label("Message").messages({
      "any.required": "Message should not be empty!",
    }),  
  }).unknown();
 
  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Contact", contactSchema);

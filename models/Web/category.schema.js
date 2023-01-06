const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Category Schema
------------------
*/

var categorySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  icon: {
    type: String,
  },
  added_on: {
    type: String,
    required: true,
  },
   status: {
    type: Boolean,
    default: true,
  },    
});

categorySchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("Name").messages({
      "any.required": "Category name should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

categorySchema.methods.joiValidateDelete = function (obj) {
  var schema = Joi.object({
    // id validation
    id: Joi.string().hex().length(24).required().label("ID").messages({
      "any.required": "ID must not be empty!",
      "string.pattern.base": "ID is not valid!",
    }),
  });
 
  const validation = schema.validate(obj);

  return validation;
};

categorySchema.methods.joiValidateEdit = function (obj) {
  var schema = Joi.object({
    // id validation
    id: Joi.string().hex().length(24).required().label("ID").messages({
      "any.required": "ID must not be empty!",
      "string.pattern.base": "ID is not valid!",
    }),
  });
 
  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Category", categorySchema);

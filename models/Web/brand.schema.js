const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Category Schema
------------------
*/

var brandSchema = mongoose.Schema({
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


brandSchema.methods.joiValidateToggle = function (obj) {
  var schema = Joi.object({
   id: Joi.string().required().label("ID").messages({
      "any.required": "ID should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

 
brandSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("Name").messages({
      "any.required": "Brand name should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};
 
brandSchema.methods.joiValidateEdit = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("Name").messages({
      "any.required": "Brand name should not be empty!",
    }),
    id: Joi.string().required().label("ID").messages({
      "any.required": "ID should not be empty!",
    }),
  }).options({ allowUnknown: true }); 

  const validation = schema.validate(obj);

  return validation;
};


brandSchema.methods.joiValidateDelete = function (obj) {
  var schema = Joi.object({
    // validate JOI object ID
    id: Joi.string().hex().length(24).required().label("ID").messages({
      "any.required": "ID must not be empty!",
      "string.pattern.base": "ID is not valid!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Brand", brandSchema);

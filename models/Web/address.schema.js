const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Address Schema
------------------
*/

var addressSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  apartment_no: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  updated_on: {
    type: String,
    required: true,
  },
});

addressSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    name: Joi.string().required().label("District").messages({
      "any.required": "District name should not be empty!",
    }),
    mobile: Joi.string()
      .required()
      .regex(/^[6789]\d{9}$/)
      .label("Mobile")
      .messages({
        "any.required": "Mobile number should not be empty!",
        "string.pattern.base": "Mobile number seems invalid!",
      }),
    address: Joi.string().required().label("Address").messages({
      "any.required": "Address should not be empty!",
    }),
    apartment_no: Joi.string().required().label("Apartment No").messages({
      "any.required": "Apartment No should not be empty!",
    }),
    city: Joi.string().required().label("City").messages({
      "any.required": "City should not be empty!",
    }),
    state: Joi.string().required().label("State").messages({
      "any.required": "State should not be empty!",
    }),
    landmark: Joi.string().required().label("Landmark").messages({
      "any.required": "Landmark should not be empty!",
    }),
    pincode: Joi.string().required().label("Pincode").messages({
      "any.required": "Pincode should not be empty!",
    }),
    user_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("User ID")
      .messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required!",
        "string.pattern.base": "User ID seems invalid!",
      }),
    address_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .label("Address ID")
      .messages({
        "string.empty": "Address ID is required",
        "any.required": "Address ID is required!",
        "string.pattern.base": "Address ID seems invalid!",
      }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Address", addressSchema);

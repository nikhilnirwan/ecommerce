const { string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Cart Schema
------------------
*/

var cartSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  product_data: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  order_id: {
    type: String,
    ref: "Order",
    default: "0",
  },
});

//JOi validation for USER ID
cartSchema.methods.joiValidateUserId = function (obj) {
  var schema = Joi.object({
    user_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("User ID")
      .messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required!",
        "string.pattern.base": "User ID seems invalid!",
      }),
  });

  const validation = schema.validate(obj);

  return validation;
};

cartSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    user_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("User ID")
      .messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required!",
        "string.pattern.base": "User ID seems invalid!",
      }),
    product_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Product ID")
      .messages({
        "string.empty": "Product ID is required",
        "any.required": "Product ID is required!",
        "string.pattern.base": "Product ID seems invalid!",
      }),
    quantity: Joi.number().integer().required().label("Quantity").messages({
      "number.empty": "Quantity is required",
      "any.required": "Quantity is required!",
      "number.integer": "Quantity must be an integer!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Cart", cartSchema);

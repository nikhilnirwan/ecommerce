const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Cart Schema
------------------
*/

var wishlistSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  pdata: {
    // array
    type: Array,
  },
});

//JOi validation for USER ID
wishlistSchema.methods.joiValidateUserId = function (obj) {
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

wishlistSchema.methods.joiValidate = function (obj) {
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
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Wishlist", wishlistSchema);

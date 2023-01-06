const { string, number } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Product Schema
------------------
*/

var requestSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  product_name: {
    type: String,
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  brand_name: {
    type: String,
  },
  compositon: {
    type: String,
  },
  date_time: {
    type: String,
    default: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  },
});

requestSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    user_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("User ID")
      .messages({
        "any.required": "User ID must not be empty!",
        "string.pattern.base": "User ID is not valid!",
      }),
    product_name: Joi.string().required().label("Product Name").messages({
      "any.required": "Product Name must not be empty!",
      "string.empty": "Product Name should not be empty!",
    }),
    quantity: Joi.number().required().label("Quantity").messages({
      "any.required": "Quantity must not be empty!",
      "number.base": "Quantity must be a number!",
    }),
    brand_name: Joi.string().required().label("Brand Name").messages({
      "any.required": "Brand Name must not be empty!",
      "string.empty": "Brand Name should not be empty!",
    }),
    compositon: Joi.string().required().label("Compositon").messages({
      "any.required": "Compositon must not be empty!",
      "string.empty": "Compositon should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("MedicineRequest", requestSchema);

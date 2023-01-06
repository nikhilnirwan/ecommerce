const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Address Schema
------------------
*/

var offerSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  date_time: {
    type: String,
    default: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  }
});

offerSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    product: Joi.string().required().label("Product").messages({
      "any.required": "Product should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Offer", offerSchema);

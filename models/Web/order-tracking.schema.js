const { string, number } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Cart Schema
------------------
*/

var trackingSchema = mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  order_status: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  delivery_by: {
    type: String,
  },
  date_time: {
    type: String,
  },
});

trackingSchema.methods.deleteTrackingInfo = function (obj) {
  var schema = Joi.object({
    tracking_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Tracking ID")
      .messages({
        "string.empty": "Tracking ID is required",
        "any.required": "Tracking ID is required!",
        "string.pattern.base": "Tracking ID seems invalid!",
      }),
    status: Joi.string().required().label("Status").messages({
      "string.empty": "Status is required",
      "any.required": "Status is required!",
    }),
  });

  const validation = schema.validate(obj);
  return validation;
};

trackingSchema.methods.validateTrackingInfo = function (obj) {
  var schema = Joi.object({
    order_id: Joi.string().required().label("Order ID").messages({
      "string.empty": "Order ID is required",
      "any.required": "Order ID is required!",
      // "string.pattern.base": "Order ID seems invalid!",
    }),
    order_status: Joi.string().required().label("Status").messages({
      "string.empty": "Status is required",
      "any.required": "Status is required!",
    }),
    message: Joi.string().required().label("Message").messages({
      "string.empty": "Message is required",
      "any.required": "Message is required!",
    }),
    date_time: Joi.string().required().label("Date Time").messages({
      "string.empty": "Date Time is required",
      "any.required": "Date Time is required!",
    }),
  });

  const validation = schema.validate(obj);
  return validation;
};

module.exports = mongoose.model("Tracking", trackingSchema);

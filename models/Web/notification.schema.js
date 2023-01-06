const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Notification Schema
------------------
*/

var notificationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  date_time: {
    type: String,
    required: true,
  },
});

notificationSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    title: Joi.string().required().label("Title").messages({
      "any.required": "Title name should not be empty!",
    }),
    details: Joi.string().required().label("Details").messages({
      "any.required": "Details should not be empty!",
      "String.empty": "Details should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Notification", notificationSchema);

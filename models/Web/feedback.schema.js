const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Product Schema
------------------
*/

var feedbackSchema = mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  star_rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

feedbackSchema.methods.validateFeedback = function (obj) {
  var schema = Joi.object({
    order_id: Joi.string().required().label("Order ID").messages({
      "any.required": "Order ID should not be empty!",
      "string.empty": "Order ID should not be empty!",
    }),
    star_rating: Joi.number().required().label("Star Rating").messages({
      "any.required": "Star Rating should not be empty!",
      "string.empty": "Star Rating should not be empty!",
    }),
    comment: Joi.string().label("Comment").messages({
      "any.required": "Comment should not be empty!",
      "string.empty": "Comment should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Feedback", feedbackSchema);

const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Category Schema
------------------
*/

var walletSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  txn_type: {
    type: String,
    required: true,
    enum: ["CREDIT", "DEBIT"],
  },
  amount: {
    type: Number,
    required: true,
  },
  txn_status: {
    type: String,
    required: true,
    enum: ["SUCCESS", "FAILED", "PENDING"],
  },
  cf_bundle: {
    type: String,
  },
  date_time: {
    type: String,
  },
  order_id: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
    required: true,
  },
  coupon_code: {
    type: String,
    default: ""
  },
  coupon_discount: {
    type: Number,
  },
});

// validation for add to wallet
walletSchema.methods.joiValidate = function (obj) {
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

    amount: Joi.number().required().label("Amount").messages({
      "number.empty": "Amount is required",
    }),
  }).unknown();

  const validation = schema.validate(obj);

  return validation;
};

// wallet payment response

walletSchema.methods.walletHistory = function (obj) {
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

// validation for add to wallet
walletSchema.methods.responseValidate = function (obj) {
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
    order_id: Joi.string().required().label("Order ID").messages({
      "number.empty": "Order ID is required",
      "any.required": "Order ID is required!",
    }),
    txn_status: Joi.string().required().label("Txn Status").messages({
      "string.empty": "Txn Status is required",
      "any.required": "Txn Status is required!",
    }),
    cf_bundle: Joi.string().required().label("CF Bundle").messages({
      "string.empty": "Bundle is required",
      "any.required": "Bundle is required!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Wallet", walletSchema);

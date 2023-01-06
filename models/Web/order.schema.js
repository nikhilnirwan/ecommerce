const { string, number } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Cart Schema
------------------
*/

var orderSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  order_id: {
    type: String,
    required: true,
  },
  shipping_charge: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paid_from_wallet: {
    type: Number,
    required: true,
  },
  paid_online: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    required: true,
    default: "online",
  },
  txn_status: {
    type: String,
    required: true,
    default: "pending",
  },
  order_status: {
    type: String,
    required: true,
    default: "pending",
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Address",
  },
  address_data: {
    type: String,
  },
  remark: {
    type: String,
    required: true,
    default: "Payment not received yet",
  },
  date_time: {
    type: String,
    required: true,
  },
  delivery_datetime: {
    type: String,
  },
  cf_bundle: {
    type: mongoose.Schema.Types.Mixed,
  },
  txn_id: {
       type: String,
  },
  delivery_by:{
    type: String,
  },
  return_status: {
    type: Boolean,
    default: false,
  },
  
  return_remark: {
    type: String,
  },
  
  coupon_discount: {
    type: Number,
    default: 0,
  },
  
  coupon_code: {
    type: String,
  },
}); 

orderSchema.methods.UpdateOrder = function (obj) {
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
      "string.empty": "Order ID is required",
      "any.required": "Order ID is required!",
    }),
    txn_status: Joi.string().required().label("Txn Status").messages({
      "string.empty": "Txn Status is required",
      "any.required": "Txn Status is required!",
    }),
    cf_bundle: Joi.string().required().label("Payment Bundle").messages({
      "string.empty": "Payment Bundle is required",
      "any.required": "Payment Bundle is required!",
    }),
    txn_id: Joi.string().required().label("TXN ID").messages({
      "string.empty": "TXN ID is required",
      "any.required": "TXN ID is required!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

orderSchema.methods.cancelOrder = function (obj) {
  var schema = Joi.object({
    order_id: Joi.string().required().label("Order ID").messages({
      "string.empty": "Order ID is required",
      "any.required": "Order ID is required!",
    }),
    
  });
  const validation = schema.validate(obj);
  return validation;
};


orderSchema.methods.returnOrder = function (obj) {
  var schema = Joi.object({
    order_id: Joi.string().required().label("Order ID").messages({
      "string.empty": "Order ID is required",
      "any.required": "Order ID is required!",
    }),
    return_feedback: Joi.string().required().label("Return Feedback").messages({
      "string.empty": "Return Feedback is required",
      "any.required": "Return Feedback is required!",
    }),
  });
  const validation = schema.validate(obj);
  return validation;
};

orderSchema.methods.returnOrderHandle = function (obj) {
  var schema = Joi.object({
    order_id: Joi.string().required().label("Order ID").messages({
      "string.empty": "Order ID is required",
      "any.required": "Order ID is required!",
    }),
    status: Joi.string().required().label("Status").messages({
      "string.empty": "Status is required",
      "any.required": "Status is required!",
    }),
  });
  const validation = schema.validate(obj);
  return validation;
};


orderSchema.methods.joiValidateDelivery = function (obj) {
  var schema = Joi.object({
    id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .label("Order ID")
    .messages({
      "any.required": "Order ID must not be empty!",
      "string.pattern.base": "Order ID is not valid!",
    }),
    date: Joi.string().required().label("Date").messages({
      "any.required": "Date must not be empty!",
    }), 
  });

  const validation = schema.validate(obj);

  return validation;
};


orderSchema.methods.orderPreview = function (obj) {
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


orderSchema.methods.joiUpdatePayment = function (obj) {
  var schema = Joi.object({
    id: Joi.string().required().label("Order ID").messages({
      "string.empty": "Order ID is required",
      "any.required": "Order ID is required!",
    }),
    status: Joi.string().required().label("Status").messages({
      "string.empty": "Status is required",
      "any.required": "Status is required!",
    }),
  });

  const validation = schema.validate(obj);
  return validation;
};

orderSchema.methods.orderDetails = function (obj) {
  var schema = Joi.object({
    order_id: Joi.string().required().label("Order ID").messages({
      "string.empty": "Order ID is required",
      "any.required": "Order ID is required!",
    }),
  });

  const validation = schema.validate(obj);
  return validation;
};

orderSchema.methods.joiValidate = function (obj) {
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

    method: Joi.string().required().label("Method").messages({
      "string.empty": "Method is required",
      "any.required": "Method is required!",
    }),
    address: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Address ID")
      .messages({
        "string.empty": "Address ID is required",
        "any.required": "Address ID is required!",
        "string.pattern.base": "Address ID seems invalid!",
      }),
    wallet_status: Joi.string().required().label("Wallet Status").messages({
      "string.empty": "Wallet Status is required",
      "any.required": "Wallet Status is required!",
    }),
  }).unknown();

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("Order", orderSchema);

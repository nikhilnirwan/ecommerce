const Joi = require("joi");
const mongoose = require("mongoose");

/*
    ------------------
    Category Schema
    ------------------
*/

var couponSchema = mongoose.Schema({
    coupon_code: {
        type: String,
        required: true,
    },
    expiry: {
        type: String,
        required: true, 
    },
    status: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true,
    }, 
    added_on: {
        // date format: dd-mm-yyyy hh:mm:ss
        type: String,
        default: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            hour12: false,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            day: "numeric",
            month: "numeric",
            year: "numeric",
        }),
    },
    type: {
        type: String,
    },
    discount: {
        type: Number,
        required: true,
    },
    is_once: {
        type: String,
    }, 
    one_time: {
        type: String,
        default: "yes" 
    }, 
    order_above: {
        type: Number,
        default: 0 
    },
    coupon_type: {
        type: String,
        default: "order" 
    }
});
 


couponSchema.methods.joiValidateDelete = function (obj) {
    var schema = Joi.object({
        id: Joi.string().required().label("ID").messages({
            "any.required": "ID should not be empty!",
        }),
    });
	
    const validation = schema.validate(obj);
    
    return validation;
};


couponSchema.methods.validateCouponCode = function (obj) {
    var schema = Joi.object({
        coupon_code: Joi.string().required().label("Coupon Code").messages({
            "any.required": "Coupon Code should not be empty!",
        }),
        order_amount: Joi.string().required().label("Order Amount").messages({
            "any.required": "Order Amount should not be empty!",
        }),
         user_id: Joi.string().required().label("User ID").messages({
            "any.required": "User ID should not be empty!",
        }),
    });
    
    const validation = schema.validate(obj);
    
    return validation;
};


couponSchema.methods.joiValidateToggle = function (obj) {
  var schema = Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Coupon ID")
      .messages({
        "any.required": "Coupon ID must not be empty!",
        "string.pattern.base": "Coupon ID is not valid!",
      }),
  });

  const validation = schema.validate(obj);

  return validation;
};

couponSchema.methods.joiValidateUpdate = function (obj) {
    var schema = Joi.object({
        id: Joi.string().required().label("ID").messages({
            "any.required": "ID should not be empty!",
        }),
		coupon_code: Joi.string()
        // regex for alpha numeric
        .regex(/^[a-zA-Z0-9]{3,20}$/)
        .required() 
        .label("Coupon Code")
        .messages({ 
            "string.empty": "Coupon Code is required",
            "any.required": "Coupon Code is required!",
            "string.pattern.base": "Coupon Code seems invalid!",
        }),
        discount: Joi.number().required().label("Discount").messages({
            "any.required": "Discount should not be empty!",
        }),
        type: Joi.string().required().label("Discount Type").messages({
            "any.required": "Discount Type should not be empty!",
        }),
        expiry: Joi.string().required().label("Expiry").messages({
            "any.required": "Expiry should not be empty!",
        }),
        // is_once: Joi.string().required().label("Is Once").messages({
            // "any.required": "Is Once should not be empty!",
        // }),
        one_time: Joi.string().required().label("One time use").messages({
            "any.required": "One time use should not be empty!",
        }),
        description: Joi.string().required().label("Description").messages({
            "any.required": "Description should not be empty!",
        }),
    }).unknown();
    
    const validation = schema.validate(obj);
    
    return validation;
};

couponSchema.methods.joiValidate = function (obj) {
    var schema = Joi.object({
        coupon_code: Joi.string()
        // regex for alpha numeric
        .regex(/^[a-zA-Z0-9]{3,20}$/)
        .required()
        .label("Coupon Code")
        .messages({
            "string.empty": "Coupon Code is required",
            "any.required": "Coupon Code is required!",
            "string.pattern.base": "Coupon Code seems invalid!",
        }),
        discount: Joi.number().required().label("Discount").messages({
            "any.required": "Discount should not be empty!",
        }),
        type: Joi.string().required().label("Discount Type").messages({
            "any.required": "Discount Type should not be empty!",
        }),
        expiry: Joi.string().required().label("Expiry").messages({
            "any.required": "Expiry should not be empty!",
        }),
        // is_once: Joi.string().required().label("Is Once").messages({
            // "any.required": "Is Once should not be empty!",
        // }),
        one_time: Joi.string().required().label("One time use").messages({
            "any.required": "One time use should not be empty!",
        }),
        coupon_type: Joi.string().required().label("Coupon Type").messages({
            "any.required": "Coupon Type should not be empty!",
        }),
        description: Joi.string().required().label("Description").messages({
            "any.required": "Description should not be empty!",
        }),
    }).unknown();
    
    const validation = schema.validate(obj);
    
    return validation;
};



module.exports = mongoose.model("Coupon", couponSchema);

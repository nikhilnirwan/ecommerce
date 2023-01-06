const Joi = require("joi");
const mongoose = require("mongoose");

/*
    ------------------
    Category Schema
    ------------------
*/
 
var redeemSchema = mongoose.Schema({
    coupon_code: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    }, 
	discount: {
        type: String,
        required: true,
    }, 
    date: {
        type: String,
    },
	time: {
		type: String,
	},
    coupon_type: {
		type: String,
        default: "order"
	}
});





redeemSchema.methods.joiValidate = function (obj) {
    var schema = Joi.object({
        user_id: Joi.string().required().label("ID").messages({
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
        date: Joi.number().required().label("Date").messages({
            "any.required": "Date should not be empty!",
        }),
        time: Joi.number().required().label("Time").messages({
            "any.required": "Time should not be empty!",
        }),
    });
    
    const validation = schema.validate(obj);
    
    return validation;
};


module.exports = mongoose.model("Redeem", redeemSchema);

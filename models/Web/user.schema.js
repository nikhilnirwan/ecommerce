const Joi = require("joi");
const mongoose = require("mongoose");

/*
    ------------------
    Category Schema
    ------------------
*/

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desigination: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: false,
    },
    bussiness_name: {
        type: String,
        required: true,
    },
    shop_address: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    ref_by_code: {
        type: String,
    },
    added_on: {
        type: String,
        required: true,
    },
    druglic: {
        type: String,
    },
    gst: {
        type: String,
    },
    otp: {
        type: String,
    },
    appr_status: {
        type: String,
        default: "false",
    },
    reject_status: {
        type: String,
        default: "false",
    },
    reject_remark: {
        type: String,
    },
    cert_form20: {
        type: String,
    },
    cert_form21: {
        type: String,
    },
    cert_form20b: {
        type: String,
    },
    cert_form21b: {
        type: String,
    },
    cert_form20d: {
        type: String,
    },
    cert_form20c: {
        type: String,
    },
    cert_fssai_central: {
        type: String,
    },
    cert_insecticide: {
        type: String,
    },
    cert_fssai_state: {
        type: String,
    },
    gst_no: {
        type: String,
    },
    wallet: {
        type: Number,
        default: 0,
    }, 
    date_time: {
        type: String,
    },     
    last_active: {
        type: String,  
    }   
});


userSchema.methods.joiDocumentUpload = function (obj) {
    var schema = Joi.object({
        id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .label("User ID")
        .messages({
            "string.empty": "User ID is required",
            "any.required": "User ID is required!",
            "string.pattern.base": "User ID seems invalid!",
        }), 
        name: Joi.string()
        .required()
        .label("User ID")
        .messages({
            "string.empty": "Key is required",
            "any.required": "Key is required!",
        }),
        
    });
    
    const otp_validation = schema.validate(obj);
    
    return otp_validation;
};



userSchema.methods.joiValidateRemark = function (obj) {
    var schema = Joi.object({
        user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .label("User ID")
        .messages({
            "string.empty": "User ID is required",
            "any.required": "User ID is required!",
            "string.pattern.base": "User ID seems invalid!",
        }),
        remark: Joi.string()
        .required()
        .label("Remark")
        .messages({
            "string.empty": "Remark is required",
            "any.required": "Remark is required!",
        }),
    });
    
    const otp_validation = schema.validate(obj);
    
    return otp_validation;
};

userSchema.methods.validateOtp = function (obj) {
    var schema = Joi.object({
        mobile: Joi.string()
        .regex(/^[6789]\d{9}$/)
        .required()
        .label("Mobile No.")
        .messages({
            "any.required": "Mobile must not be empty!",
            "string.pattern.base": "Mobile number seems invalid!",
        }),
    });
    
    const otp_validation = schema.validate(obj);
    
    return otp_validation;
};

userSchema.methods.joiValidateUserId = function (obj) {
    var schema = Joi.object({
        user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .label("User ID")
        .messages({
            "string.empty": "User ID is required",
            "any.required": "User ID is required!",
            "string.pattern.base": "User ID seems invalid!",
        }),
    });
    
    const otp_validation = schema.validate(obj);
    
    return otp_validation;
};


userSchema.methods.joiValidateFilter = function (obj) {
    var schema = Joi.object({
    
        filter: Joi.string().required().label("Filter").messages({
            "any.required": "Filter must not be empty!",
        }),
        status: Joi.string().required().label("Status").messages({
            "any.required": "Status must not be empty!",
        }),
    });
  
    const filter = schema.validate(obj);
    
    return filter;
}

userSchema.methods.validateProfileUpdate = function (obj) {
    var schema = Joi.object({
        user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .label("User ID")
        .messages({
            "string.empty": "User ID is required",
            "any.required": "User ID is required!",
            "string.pattern.base": "User ID seems invalid!",
        }),
        name: Joi.string().label("Name").messages({
            "any.required": "Name must not be empty!",
            "any.empty": "Name must not be empty!",
        }),
        email: Joi.string().email().label("Email").messages({
            "any.required": "Email must not be empty!",
            "string.email": "Email must be valid!",
        }),
    });
    
    const profile_update = schema.validate(obj);
    return profile_update;
};

userSchema.methods.verifyOTPValidation = function (obj) {
    var schema = Joi.object({
        mobile: Joi.string()
        .regex(/^[6789]\d{9}$/)
        .required()
        .label("Mobile No.")
        .messages({
            "any.required": "Mobile must not be empty!",
            "string.pattern.base": "Mobile number seems invalid!",
        }),
        otp: Joi.string()
        .regex(/^\d{4}$/)
        .required()
        .label("OTP ")
        .messages({
            "any.required": "OTP must not be empty!",
            "string.pattern.base": "OTP must be 4 digit!",
        }),
    });
    
    const verifyotp = schema.validate(obj);
    
    return verifyotp;
};

userSchema.methods.joiValidate = function (obj) {
    var schema = Joi.object({
        name: Joi.string().required().label("Name").messages({
            "any.required": "Name must not be empty!",
        }),
        desigination: Joi.string().required().label("Desigination").messages({
            "any.required": "Desigination must not be empty!",
        }),
        mobile: Joi.string()
        .regex(/^[6789]\d{9}$/)
        .required()
        .label("Mobile No.")
        .messages({
            "any.required": "Mobile must not be empty!",
            "string.pattern.base": "Mobile number seems invalid!",
        }),
        bussiness_name: Joi.string().required().label("Business Name").messages({
            "any.required": "Bussiness name must not be empty!",
        }),
        shop_address: Joi.string().required().label("Shop Address").messages({
            "any.required": "Shop Address must not be empty!",
        }),
        pincode: Joi.string()
        .regex(/^[1-9][0-9]{5}$/)
        .required()
        .label("Pin Code")
        .messages({
            "any.required": "Pin Code must not be empty!",
            "string.pattern.base": "Pin Code does'nt seems valid!",
        }),
        state: Joi.string().required().label("State").messages({
            "any.required": "State must not be empty!",
        }),
        district: Joi.string().required().label("District").messages({
            "any.required": "District must not be empty!",
        }),
        ref_by_code: Joi.string(),
        gst_no: Joi.string()
        .regex(/^[0-9a-zA-Z]{15}$/)
        .required()
        .label("GST No.")
        .messages({
            "any.required": "GST No. must not be empty!",
            "string.pattern.base": "GST No. must be 15 digit alphanumeric value!",
        }), 
    }).unknown();
    
    const validation = schema.validate(obj);
    
    return validation;
};

module.exports = mongoose.model("User", userSchema);

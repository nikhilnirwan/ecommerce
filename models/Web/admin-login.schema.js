const Joi = require("joi");
const mongoose = require("mongoose");

/*
------------------
Admin Login Schema
------------------
*/

var adminLoginSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminLoginSchema.methods.changePassword = function (obj) {
  var schema = Joi.object({
    old: Joi.string().required().label("Old Password").messages({
      "string.empty": "Old Password is required!",
    }),
    new: Joi.string().min(5).required().label("Password").messages({
      "string.empty": "Password is required",
      "string.min": "Password must be atleast 5 characters",
    }),
    // new password must be same as new
    confirm: Joi.string()
      .required()
      .valid(Joi.ref("new"))
      .label("Confirm Password")
      .messages({
        "any.only": "Confirm password must be same as new password!",
        "string.empty": "New password must not be empty!",
      }),
  });

  const validation = schema.validate(obj);
  return validation;
};

adminLoginSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    email: Joi.string().required().label("Email ID").email().messages({
      "string.email": "Email ID is invalid!",
      "any.required": "Email ID is required!",
    }),
    password: Joi.string().min(5).required().label("Password").messages({
      "string.empty": "Password must not be empty!",
      "string.min": "Password is too short, min. 5 required!",
      "any.required": "Password is required!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};

module.exports = mongoose.model("AdminLogin", adminLoginSchema);

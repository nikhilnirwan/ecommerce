const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");
const upload = multer();

router.post("/verify-otp", upload.none(), function (req, res, next) {
  try {
    var data_obj = {
      mobile: req.body.mobile,
      otp: req.body.otp,
    };
    const user = new User(data_obj);
    var err = user.verifyOTPValidation(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      User.findOne({ mobile: data_obj.mobile }, function (err, docs) {
        if (!err) {
          if (docs) {
            if (docs.otp === data_obj.otp) {
              var final = {
                res: "success",
                msg: "Logged in successfully.",
                data: docs,
              };
              res.status(200).send(final);
            } else {
              var final = {
                res: "error",
                msg: "Please enter valid OTP!",
              };
              res.status(400).send(final);
            }
          } else {
            var final = {
              res: "error",
              msg: "Mobile no. not exist!",
            };
            res.status(400).send(final);
          }
        }
      });
    }
  } catch (e) {
    var final = {
      res: "error",
      msg: "Something went wrong!",
      data: [],
    };
    res.status(400).send(final);
  }
});

module.exports = router;

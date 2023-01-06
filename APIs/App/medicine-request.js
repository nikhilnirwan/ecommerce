const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const User = require("./../../models/Web/user.schema");
const MedRequest = require("./../../models/Web/request-medicine.schema.js");
const upload = multer();

const DateTime = require("./../../modules/date-time");
const { equal } = require("joi");

router.post("/medicine-request", upload.none(), function (req, res, next) {
  const medrequest = new MedRequest(req.body);
  const err = medrequest.joiValidate(req.body);
  req.body.date_time = DateTime.date() + " " + DateTime.time();
  if (err.error) {
    res.status(400).json({
      status: "error",
      message: err.error.details[0].message,
    });
  } else {
    // verify user
    User.findOne({ _id: req.body.user_id }, function (err, user) {
      if (user) {
        medrequest.save(function (err, medrequest) {
          if (err) {
            res.status(400).json({
              status: "error",
              message: "Something went wrong!",
            });
          } else {
            res.status(200).json({
              status: "success",
              message: "Medicine Request Successfully Submitted!",
              data: medrequest,
            });
          }
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "User ID is invalid!",
        });
      }
    });
  }
});

module.exports = router;

const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Address = require("./../../models/Web/address.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();
const DateTime = require("./../../modules/date-time");

router.post("/show-address", upload.none(), function (req, res, next) {
  try {
    // check if user is valid
    var user_id = req.body.user_id;

    // validate user
    User.findById(user_id, function (err, user) {
      if (user) {
        //   get all address of user
        Address.find({ user_id: user_id }, function (err, address) {
          if (address.length != 0) {
            var final = {
              res: "success",
              msg: address.length + " address(s) found.",
              data: address,
            };
            res.status(200).send(final);
          } else {
            var final = {
              res: "error",
              msg: address.length + " address(s) found.",
              data: address,
            };
            res.status(400).send(final);
          }
        });
      } else {
        var final = {
          res: "error",
          msg: "User ID is not valid!",
        };
        res.status(400).send(final);
      }
    });
  } catch (err) {
    var final = {
      res: "error",
      msg: "Something went wrong!",
    };
    res.status(400).send(final);
  }
});

module.exports = router;

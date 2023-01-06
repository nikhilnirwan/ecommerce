const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Address = require("./../../models/Web/address.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();
const DateTime = require("./../../modules/date-time");

router.post("/add-address", upload.none(), function (req, res, next) {
  try {
    // check if user is valid
    var user_id = req.body.user_id;

    // validate user
    User.findById(user_id, function (err, user) {
      if (user) {
        var data_object = {
          user_id: req.body.user_id,
          name: req.body.name,
          mobile: req.body.mobile,
          address: req.body.address,
          apartment_no: req.body.apartment_no,
          city: req.body.city,
          state: req.body.state,
          landmark: req.body.landmark,
          pincode: req.body.pincode,
          updated_on: DateTime.date() + " " + DateTime.time(),
        };
        const address = new Address(data_object);
        var err = address.joiValidate(req.body);
        if (err.error) {
          var final = {
            res: "error",
            msg: err.error.details[0].message,
          };

          res.status(400).send(final);
        } else {
          address.save(function (err, result) {
            if (err) {
              res.send(err);
              var final = {
                res: "error",
                msg: "Something went wrong!",
                data: [],
              };
              res.status(400).send(final);
            } else {
              var final = {
                res: "success",
                msg: "Address added successfully",
                data: result,
              };
              res.status(200).send(final);
            }
          });
        }
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

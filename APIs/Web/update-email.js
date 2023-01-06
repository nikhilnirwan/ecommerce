const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");

const { parse } = require("dotenv");
const upload = multer();

const Admin = require("./../../models/Web/admin-login.schema");

router.post("/update-email", upload.none(), function (req, res, next) {
  const admin = new Admin(req.body);
  const err = admin.joiValidate(req.body);
  console.log(req.body);
  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    // find admin by id
    Admin.findById("626ba084d6b3a684148b456a", function (err, admin) {
      if (admin) {
        if (admin.password === req.body.password) {
          Admin.findByIdAndUpdate(
            "626ba084d6b3a684148b456a",
            { email: req.body.email },
            function (err, docs) {
              console.log(err);
              if (docs) {
                var final = {
                  res: "success",
                  msg: "Email changed successfully.",
                };
                res.status(200).send(final);
              } else {
                var final = {
                  res: "error",
                  msg: "Something went wrong!",
                  data: [],
                };
                res.status(400).send(final);
              }
            }
          );
        } else {
          var final = {
            res: "error",
            msg: "Old password is incorrect!",
          };
          res.status(400).send(final);
        }
      } else {
        var final = {
          res: "error",
          msg: "Something went wrong!",
          data: [],
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

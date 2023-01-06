const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");

const { parse } = require("dotenv");
const upload = multer();

const Admin = require("./../../models/Web/admin-login.schema");

router.post("/change-admin-password", upload.none(), function (req, res, next) {
  const admin = new Admin(req.body);
  const err = admin.changePassword(req.body);
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
        console.log(admin);
        console.log(req.body.old);
        // covert to string
        const str = req.body.old.toString();
        const newpass = req.body.confirm.toString();
        if (admin.password == str) {
          Admin.findByIdAndUpdate(
            "626ba084d6b3a684148b456a",
            { password: newpass },
            function (err, docs) {
              console.log(err);
              if (docs) {
                var final = {
                  res: "success",
                  msg: "Password changed successfully.",
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

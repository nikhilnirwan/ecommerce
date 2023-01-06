const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Coupon = require("./../../models/Web/coupon.schema");

router.post("/toggle-coupon", upload.none(), function (req, res, next) {
  const coupon = new Coupon(req.body);
  const err = coupon.joiValidateToggle(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
      data: [],
    };
    res.status(400).send(final);
  } else {
    //find brand by id
    Coupon.findById(req.body.id, function (err, result) {
      if (result) {
        // toggle brand status
        var status = "true";
        if (result.status == true) {
          status = false;
        } else {
          status = true;
        }

        // update product status
        Coupon.findByIdAndUpdate(
          req.body.id,
          { status: status },
          { new: true },
          function (err, result) {
            if (result) {
              var msg = "";
              if (status == true) {
                msg = "Coupon activated successfully.";
              } else {
                msg = "Coupon deactivated successfully.";
              }
              var final = {
                res: "success",
                msg: msg,
                data: result,
              };
              res.status(200).send(final);
            } else {
              var final = {
                res: "error",
                msg: "Something went wrong!",
              };
              res.status(400).send(final);
            }
          }
        );
      } else {
        var final = {
          res: "error",
          msg: "Invalid Coupon ID!",
          data: [],
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

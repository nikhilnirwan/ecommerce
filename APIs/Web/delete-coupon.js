const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const Coupon = require("./../../models/Web/coupon.schema");
const upload = multer();
const Product = require("./../../models/Web/product.schema");

router.post("/delete-coupon", upload.none(), function (req, res, next) {
  if (req.body) {
    const coupon = new Coupon(req.body);
    const err = coupon.joiValidateDelete(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      // validate id
      Coupon.findOne({ _id: req.body.id }, function (err, doc) {
        if (doc) {
           Coupon.findByIdAndDelete(req.body.id, function (err, doc) {
			if (err) {
			  var final = {
				res: "error",
				msg: "Something went wrong!",
			  };
			  res.status(400).send(final);
			} else {
			  var final = {
				res: "success",
				msg: "Coupon deleted successfully!",
			  };
			  res.status(200).send(final);
			}
		  });
        } else {
          var final = {
            res: "error",
            msg: "Coupon ID is invalid!",
          };
          res.status(400).send(final);
        }
      });
    }
  } else {
    var final = {
      res: "error",
      msg: "Body can't be empty!",
    };
    res.status(400).send(final);
  }
});

module.exports = router;

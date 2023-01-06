const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const Brand = require("./../../models/Web/brand.schema");
const upload = multer();
const Product = require("./../../models/Web/product.schema");

router.post("/delete-brand", upload.none(), function (req, res, next) {
  if (req.body) {
    const brand = new Brand(req.body);
    const err = brand.joiValidateDelete(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      // validate id
      Brand.findOne({ _id: req.body.id }, function (err, doc) {
        if (doc) {
          //   check if product exist with this brand
          Product.findOne({ brand: req.body.id }, function (err, doc) {
            if (doc) {
              var final = {
                res: "error",
                msg: "Brand can't be deleted, product are mapped with this!",
              };
              res.status(400).send(final);
            } else {
              // delete brand
              Brand.findByIdAndDelete(req.body.id, function (err, doc) {
                if (err) {
                  var final = {
                    res: "error",
                    msg: "Something went wrong!",
                  };
                  res.status(400).send(final);
                } else {
                  var final = {
                    res: "success",
                    msg: "Brand deleted successfully!",
                  };
                  res.status(200).send(final);
                }
              });
            }
          });
        } else {
          var final = {
            res: "error",
            msg: "Brand ID is invalid!",
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

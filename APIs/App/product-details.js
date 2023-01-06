const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("./../../models/Web/product.schema");
const upload = multer();

router.post("/product-details", upload.none(), function (req, res, next) {
  console.log(req.body);
  try {
    var where = {
      _id: req.body.product_id,
    };
    const product = new Product(where);
    var err = product.productDetails(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      Product.findById(req.body.product_id)
        .populate("category")
        .populate("brand")
        .exec({}, function (err, docs) {
          if (err) {
            if (err.name == "CastError") {
              var final = {
                res: "error",
                msg: "Product ID format is invalid!",
                data: [],
              };
            } else {
              var final = {
                res: "error",
                msg: "Somethding went wrong!",
                data: [],
              };
            }
            res.status(400).send(final);
          } else {
            var final = {
              res: "success",
              msg: "Product found successfully!",
              data: docs,
            };
            res.status(200).send(final);
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

const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Product = require("./../../models/Web/product.schema");

router.post("/delete-product", upload.none(), function (req, res, next) {
  if (req.body) {
    const product = new Product(req.body);
    const err = product.joiValidateDelete(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      // validate id
      Product.findOne({ _id: req.body.id }, function (err, doc) {
        if (doc) {
			Product.findByIdAndDelete(req.body.id, function (err, doc) {
                if (err) {
                  var final = {
                    res: "error",
                    msg: "Something went wrong!",
                  };
                  res.status(400).send(final);
                } else {
                  var final = {
                    res: "success",
                    msg: "Product deleted successfully!",
                  };
                  res.status(200).send(final);
                }
              });
        } else {
          var final = {
            res: "error",
            msg: "Product ID is invalid!",
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

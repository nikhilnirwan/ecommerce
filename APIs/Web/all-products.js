const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Product = require("./../../models/Web/product.schema");

const upload = multer();

router.get("/all-product", upload.none(), function (req, res, next) {
  // all product
  try {
    Product.find()
      .populate("category")
      .populate("brand")
      .sort({ _id: -1 })
      .exec({}, function (err, docs) {
        if (err) {
          var final = {
            res: "error",
            msg: "Something went wrong!",
            data: [],
          };
          res.status(400).send(final);
        } else {
          console.log(docs);
          
          var docs = JSON.parse(JSON.stringify(docs));
            
          for(each of docs)
          {
            each.category_name = each.category.name;
            each.brand_name = each.brand.name;
          }
          
          var final = {
            res: "success",
            msg: docs.length + " product(s) found.",
            data: docs,
          };
          res.status(200).send(final);
        }
      });
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

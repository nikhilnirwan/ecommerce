const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("./../../models/Web/product.schema");

const DateTime = require("./../../modules/date-time");

// Multer Configuration for single file upload

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/product/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

var upload = multer({
  storage: storage,
});

router.post(
  "/add-product",
  upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
  ]),
  function (req, res, next) {
    try {
      if (typeof req.files.image4 !== "undefined") {
        var filename4 = req.files.image4[0].filename;
      } else {
        var filename4 = "";
      }

      if (typeof req.files.image3 !== "undefined") {
        var filename3 = req.files.image3[0].filename;
      } else {
        var filename3 = "";
      }

      if (typeof req.files.image2 !== "undefined") {
        var filename2 = req.files.image2[0].filename;
      } else {
        var filename2 = "";
      }

      var data_obj = {
        name: req.body.name,
        category: req.body.category,
        brand: req.body.brand,
        stock: req.body.stock,
        mrp: req.body.mrp,
        offerprice: req.body.offerprice,
        discount: req.body.discount,
        details: req.body.details,
        details: req.body.details,
        image1: req.files.image1[0].filename,
        image2: filename2,
        image3: filename3,
        image4: filename4,
        expiry: req.body.expiry,
        added_on: DateTime.date() + " " + DateTime.time(),
        pack_info: req.body.pack_info,
        compositon: req.body.compositon,
        allowed_cert: req.body.allowed_cert,
      };
      const product = new Product(data_obj);
      var err = product.joiValidate(req.body);
      if (err.error) {
        var final = {
          res: "error",
          msg: err.error.details[0].message,
        };
        res.status(400).send(final);
      } else {
        product.save(function (err, doc) {
          if (err) {
            var final = {
              res: "error",
              msg: "Something went wrong!",
              data: [],
            };
            res.status(400).send(final);
          } else {
            var final = {
              res: "success",
              msg: "Product added successfully!",
              data: doc,
            };
            res.status(201).send(final);
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
  }
);

module.exports = router;

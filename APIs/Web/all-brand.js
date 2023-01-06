const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const Brand = require("./../../models/Web/brand.schema");
const upload = multer();
const Product = require("./../../models/Web/product.schema");

router.get("/all-brand", upload.none(), function (req, res, next) {
  // all category
  try {
    Brand.find()
      .sort({ _id: -1 })
      .exec({}, async function (err, docs) {
        if (err) {
          var final = {
            res: "error",
            msg: "Something went wrong!",
            data: [],
          }; 
          res.status(400).send(final);
        } else {
          var object = JSON.parse(JSON.stringify(docs));

          for (element of object) {
            element.icon =
              process.env.BASEURL + "public/uploads/brand/" + element.icon;

            await Product.find({ brand: element._id })
              .exec()
              .then((result) => {
                if (result.length > 0) {
                  element.del_status = "false";
                } else {
                  element.del_status = "true";
                }
              });
          }

          var final = {
            res: "success",
            msg: docs.length + " brand(s) found.",
            data: object,
          };
          res.status(200).send(final);
          // console.log(req);
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

const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const Category = require("./../../models/Web/category.schema");
const upload = multer();
const Product = require("./../../models/Web/product.schema");

router.get("/all-category", upload.none(), function (req, res, next) {
  // all category
  try {
    Category.find()
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
          const custom = JSON.parse(JSON.stringify(docs));
          var status = "0";
          for (element of custom) {
            element.icon =
              process.env.BASEURL + "public/uploads/category/" + element.icon;
            // check if category has product
            await Product.find({ category: element._id })
              .exec()
              .then((result) => {
                if (result.length > 0) {
                  status = "false";
                } else {
                  status = "true";
                }
                element.del_status = status;
              });
          }
          var final = {
            res: "success",
            msg: docs.length + " category(s) found.",
            data: custom,
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

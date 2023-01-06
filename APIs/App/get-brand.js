const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const Brand = require("./../../models/Web/brand.schema");
const upload = multer();

router.get("/get-brand", upload.none(), function (req, res, next) {
  // all category
  try {
    Brand.find({status: {$ne: false}})
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
          docs.forEach((element) => {
            element.icon =
              process.env.BASEURL + "public/uploads/brand/" + element.icon;
          });

          var final = {
            res: "success",
            msg: docs.length + " brand(s) found.",
            data: docs,
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

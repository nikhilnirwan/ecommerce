const express = require("express");
const router = express.Router();
const multer = require("multer");
const Slider = require("./../../models/Web/slider.schema");
const upload = multer();

router.get("/get-slider", upload.none(), function (req, res, next) {
  // all slider
  try {
    Slider.find()
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
              process.env.BASEURL + "public/uploads/slider/" + element.icon;
          });

          console.log(process.env.BASEURL);

          var final = {
            res: "success",
            msg: docs.length + " slider(s) found.",
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

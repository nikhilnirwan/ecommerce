const express = require("express");
const router = express.Router();
const multer = require("multer");
const Slider = require("./../../models/Web/district.schema");
const upload = multer();

router.get("/all-district", upload.none(), function (req, res, next) {
  // all slider
  try {
    Slider.find()
      .populate("state")
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
          var final = {
            res: "success",
            msg: docs.length + " district(s) found.",
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

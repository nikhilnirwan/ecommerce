const express = require("express");
const router = express.Router();
const multer = require("multer");
const Slider = require("./../../models/Web/slider.schema");

const DateTime = require("./../../modules/date-time");

// Multer Configuration for single file upload

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/slider/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

var upload = multer({
  storage: storage,
});

router.post("/add-slider", upload.single("image"), function (req, res, next) {
  try {
    var data_obj = {
      name: req.body.name,
      icon: req.file.filename,
      added_on: DateTime.date() + " " + DateTime.time(),
    };

    const slider = new Slider(data_obj);
    var err = slider.joiValidate(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };

      res.status(400).send(final);
    } else {
      slider.save(function (err, doc) {
        if (err) {
          if (err.keyPattern.name) {
            var final = {
              res: "error",
              msg: "Something went wrong!",
              data: "",
            };
            res.status(400).send(final);
          } else {
            var final = {
              res: "error",
              msg: "Something went wrong!",
              data: [],
            };
            res.status(400).send(final);
          }
        } else {
          var final = {
            res: "success",
            msg: "Slider added successfully!",
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
});

module.exports = router;

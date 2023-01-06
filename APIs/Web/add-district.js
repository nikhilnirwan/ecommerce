const express = require("express");
const router = express.Router();
const multer = require("multer");
const District = require("./../../models/Web/district.schema");
const upload = multer();

const DateTime = require("./../../modules/date-time");

router.post("/add-district", upload.none(), function (req, res, next) {
  try {
    var data_obj = {
      name: req.body.name,
      state: req.body.state,
      added_on: DateTime.date() + " " + DateTime.time(),
    };
    const district = new District(data_obj);
    var err = district.joiValidate(req.body);
    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      district.save(function (err, doc) {
        if (err) {
          if (err.errors.state.name == "CastError") {
            var final = {
              res: "error",
              msg: "This state ID is invalid!",
              data: "",
            };
            res.status(400).send(final);
          } else if (err.keyPattern.name) {
            var final = {
              res: "error",
              msg: "This district already exist, try other!",
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
            msg: "District added successfully!",
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

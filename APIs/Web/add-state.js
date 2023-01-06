const express = require("express");
const router = express.Router();
const State = require("./../../models/Web/state.schema");
const multer = require("multer");
const upload = multer();

const DateTime = require("./../../modules/date-time");

router.post("/add-state", upload.none(), function (req, res, next) {
  try {
    var data_obj = {
      name: req.body.name,
      added_on: DateTime.date() + " " + DateTime.time(),
    };

    const state = new State(data_obj);
    var err = state.joiValidate(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };

      res.status(400).send(final);
    } else {
      state.save(function (err, doc) {
        if (err) {
          if (err) {
            if (err.keyPattern.name) {
              var final = {
                res: "error",
                msg: "This state already exist, try other!",
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
          }
        } else {
          var final = {
            res: "success",
            msg: "State added successfully!",
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

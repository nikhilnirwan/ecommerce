const express = require("express");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const District = require("./../../models/Web/district.schema");

const upload = multer();

router.post("/district-by-state", upload.none(), function (req, res, next) {
  if (req.body.state_id) {
    const id = req.body.state_id;
    try {
      District.find({ state: id })
        .populate("state")
        .sort({ _id: -1 })
        .exec({}, function (err, docs) {
          if (err) {
            if (err.name == "CastError") {
              var final = {
                res: "error",
                msg: "State ID is invalid",
                data: [],
              };
            } else {
              var final = {
                res: "error",
                msg: "Something went wrong!",
                data: [],
              };
            }

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
  } else {
    var final = {
      res: "error",
      msg: "State ID must not be empty!",
      data: [],
    };
    res.status(400).send(final);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const State = require("./../../models/Web/state.schema");
const upload = multer();

router.get("/all-state", upload.none(), function (req, res, next) {
  // all state
  try {
    State.find()
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
            msg: docs.length + " state(s) found.",
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

const express = require("express");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Request = require("./../../models/Web/request-medicine.schema");

const upload = multer();

router.post("/delete-request", upload.none(), function (req, res, next) {
  Request.findByIdAndDelete(req.body.req_id, function (err, docs) {
    if (docs) {
      console.log(docs);
      var final = {
        res: "success",
        msg: "Medicine request found.",
      };
      res.status(200).send(final);
    } else {
      var final = {
        res: "error",
        msg: "No data found.",
        data: [],
      };
      res.status(400).send(final);
    }
  });
});

module.exports = router;

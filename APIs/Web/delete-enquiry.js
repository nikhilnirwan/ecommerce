const express = require("express");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Request = require("./../../models/Web/contact.schema");

const upload = multer();
 
router.post("/delete-enquiry", upload.none(), function (req, res, next) {
  Request.findByIdAndDelete(req.body.req_id, function (err, docs) {
    if (docs) {
      var final = {
        res: "success",
        msg: "Request deleted successfully.",
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

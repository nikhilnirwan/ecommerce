const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const Request = require("./../../models/Web/request-medicine.schema");

router.get("/get-request", upload.none(), function (req, res, next) {
  //get all medicine request
  Request.find()
    .populate("user_id")
    .exec({}, function (err, docs) {
      if (docs) {
        
        var all_obj = JSON.parse(JSON.stringify(docs));
        
        var final = {
          res: "success",
          msg: "Medicine request found.",
          data: all_obj,
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

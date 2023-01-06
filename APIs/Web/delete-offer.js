const express = require("express");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Offer = require("./../../models/Web/offer.schema");

const upload = multer();
 
router.post(
  "/delete-offer",
  upload.none(),
  function (req, res, next) {
    Offer.findByIdAndDelete(req.body.req_id, function (err, docs) {
      if (docs) {
        console.log(docs);
        var final = {
          res: "success",
          msg: "Offer removed successfully.",
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
  }
);

module.exports = router;

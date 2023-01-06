const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Notification = require("./../../models/Web/notification.schema");

router.get("/sent-notification", upload.none(), function (req, res, next) {
  Notification.find({}, null, { sort: { _id: -1 } }, function (err, result) {
    if (result) {
      var final = {
        res: "success",
        msg: "Notification sent successfully.",
        data: result,
      };
      res.status(200).send(final);
    } else {
      var final = {
        res: "error",
        msg: "Something went wrong!",
      };
      res.status(400).send(final);
    }
  });
});

module.exports = router;

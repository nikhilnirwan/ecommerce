const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Notification = require("./../../models/Web/notification.schema");
const DateTime = require("./../../modules/date-time");
const Token = require("./../../models/Web/firebase.schema");

const firebase = require("./../../modules/firebase");

router.post("/send-notification", upload.none(), function (req, res, next) {
  const data_object = {
    title: req.body.title,
    details: req.body.details,
    date_time: DateTime.date() + " " + DateTime.time(),
  };
  const notification = new Notification(data_object);
  const err = notification.joiValidate(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };

    res.status(400).send(final);
  } else {
    notification.save(function (err, result) {
      if (result) {
        // get all tokens
        var response = "";
        Token.find({}, async function (err, tokens) {
          var count = 0;
          if (tokens) {
            for (each of tokens) {
              var data = {
                body: req.body.details,
                title: req.body.title,
              };
              response = await firebase.sendNotification(each.token, data);
              // console.log(response);
              count++;
            }
          }
          var final = {
            res: "success",
            msg: count + " Notification sent successfully.",
            data: result,
          };
          res.status(200).send(final);
        });
      } else {
        var final = {
          res: "error",
          msg: "Something went wrong!",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

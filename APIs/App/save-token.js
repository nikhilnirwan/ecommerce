const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Firebase = require("./../../models/Web/firebase.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();
const DateTime = require("./../../modules/date-time");

router.post("/save-token", upload.none(), function (req, res, next) {
  const firebase = new Firebase(req.body);
  const err = firebase.joiValidate(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    // verify user_id
    User.findById(req.body.user_id, function (err, user) {
      if (user) {
        // find by Id and update
        User.findByIdAndUpdate(req.body.user_id, { last_active: DateTime.date() + " " + DateTime.time() }, { new: true, }, function (err, result) {
          if (user) {
            Firebase.findOne({ user_id: req.body.user_id }, function (err, token) {
              if (token) {
                // do update by user_id
                Firebase.findOneAndUpdate(
                  { user_id: req.body.user_id },
                  { token: req.body.token },
                  { new: true }, 
                  function (err, result) {
                    if (result) {
                      var final = {
                        res: "success",
                        msg: "Token updated successfully!",
                        data: result,
                        user: user
                      };
                      res.status(200).send(final);
                    } else {
                      console.log("!!!!!!!!!!!");
                      console.log(err);
                      var final = {
                        res: "error",
                        msg: "Something went wrong 1!",
                      };
                      res.status(400).send(final);
                    }
                  }
                ); 
              } else {
                firebase.save(function (err, result) {
                  if (result) {
                    var final = {
                      res: "success",
                      msg: "Token saved successfully!",
                      data: result,
                    };
                    res.status(200).send(final);
                  } else {
                    var final = {
                      res: "error",
                      msg: "Something went wrong 2!",
                    };
                    res.status(400).send(final);
                  }
                });
              }
            });
          }
          else {
            var final = {
              res: "error",
              msg: "Something went wrong 3!",
            };
            res.status(400).send(final);
          }
        })

      } else {
        var final = {
          res: "error",
          msg: "User ID is not valid!",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

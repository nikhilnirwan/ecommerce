const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");
const upload = multer();

router.post("/send-otp", upload.none(), function (req, res, next) {
  // res.end(req.body);
  try {
    const user = new User(req.body);

    var err = user.validateOtp(req.body);
    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      const mobile = req.body.mobile;

      User.findOne({ mobile: mobile }, function (err, docs) {
        if (!err) {
          if (docs) {
            
            //genrate new otp
            // var otp = Math.floor(100000 + Math.random() * 900000);
            //static otp
            var otp = 1234;

            //update otp
            User.findOneAndUpdate(
              { mobile: mobile },
              { otp: otp },
              {
                returnOriginal: false,
              }, 
              function (err, docs) {
                if (!err) {
                  if (docs.appr_status == "true") {
                    
                    var ret_obj = {
                      mobile: docs.mobile
                    };
                   
                    var final = {
                      res: "success",
                      msg: "OTP sent successfully to " + docs.mobile + ".",
                      status: "true",
                      data: ret_obj
                    }; 
                    res.status(200).send(final);
                  } else {
                    var final = {
                      res: "success",
                      msg: "You're account is not verified, please wait till verification.",
                      status: "false",
                    };
                    res.status(400).send(final);
                  }
                } else {
                  var final = {
                    res: "error",
                    msg: "Something went wrong!",
                    data: [],
                  };
                  res.status(400).send(final);
                }
              }
            );
          } else {
            var final = {
              res: "error",
              msg: "Mobile no. not exist!",
            };
            res.status(400).send(final);
          }
        } else {
          var final = {
            res: "error",
            msg: "Something went wrong!",
            data: [],
          };
          res.status(400).send(final);
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

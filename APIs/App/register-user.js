const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");

const DateTime = require("./../../modules/date-time");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/docs/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

var upload = multer({
  storage: storage,
});

router.post(
  "/register-user",
  upload.fields([
    { name: "gst" },
    { name: "druglic" },
    { name: "cert_form20" },
    { name: "cert_form21" },
    { name: "cert_form20b" },
    { name: "cert_form21b" },
    { name: "cert_form20d" },
    { name: "cert_form20c" },
    { name: "cert_insecticide" },
    { name: "cert_fssai_state" },
    { name: "cert_fssai_central" },
    { name: "appr_status" },
  ]),
  function (req, res, next) {
    try {
      var status  = "true";
      if (typeof req.files.gst !== "undefined") {
        var gst = req.files.gst[0].filename;
      } else {
        // var status = "false";
      }

      if (typeof req.files.druglic !== "undefined") {
        var druglic = req.files.druglic[0].filename;
      } else {
        //var status = "false";
      }

      var cert_form20 = "";
      if (typeof req.files.cert_form20 !== "undefined") {
        var cert_form20 = req.files.cert_form20[0].filename;
      } else {
        //var status = "false";
      }

      var cert_form21 = "";
      if (typeof req.files.cert_form21 !== "undefined") {
        var cert_form21 = req.files.cert_form21[0].filename;
      }

      var cert_form20b = "";
      if (typeof req.files.cert_form20b !== "undefined") {
        var cert_form20b = req.files.cert_form20b[0].filename;
      }

      var cert_form21b = "";
      if (typeof req.files.cert_form21b !== "undefined") {
        var cert_form21b = req.files.cert_form21b[0].filename;
      }

      var cert_form20d = "";
      if (typeof req.files.cert_form20d !== "undefined") {
        var cert_form20d = req.files.cert_form20d[0].filename;
      }

      var cert_form20c = "";
      if (typeof req.files.cert_form20c !== "undefined") {
        var cert_form20c = req.files.cert_form20c[0].filename;
      }

      var cert_insecticide = "";
      if (typeof req.files.cert_insecticide !== "undefined") {
        var cert_insecticide = req.files.cert_insecticide[0].filename;
      }

      var cert_fssai_state = "";
      if (typeof req.files.cert_fssai_state !== "undefined") {
        var cert_fssai_state = req.files.cert_fssai_state[0].filename;
      }

      var cert_fssai_central = "";
      if (typeof req.files.cert_fssai_central !== "undefined") {
        var cert_fssai_central = req.files.cert_fssai_central[0].filename;
      }
      
      var code = req.body.ref_by_code
      
      if(code=="")
      {
          code = "00000";
          req.body.ref_by_code = "00000";
      }
      else
      {
          code = req.body.ref_by_code;
          req.body.ref_by_code = code;
      }

      var data_obj = {
        name: req.body.name,
        desigination: req.body.desigination,
        mobile: req.body.mobile,
        email: req.body.email,
        bussiness_name: req.body.bussiness_name,
        shop_address: req.body.shop_address,
        pincode: req.body.pincode,
        state: req.body.state,
        district: req.body.district,
        ref_by_code: code,
        druglic: druglic,
        gst: gst,
        cert_form20: cert_form20,
        cert_form21: cert_form21,
        cert_form20b: cert_form20b,
        cert_form21b: cert_form21b,
        cert_form20d: cert_form20d,
        cert_form20c: cert_form20c,
        cert_insecticide: cert_insecticide,
        cert_fssai_state: cert_fssai_state,
        cert_fssai_central: cert_fssai_central,
        added_on: DateTime.date() + " " + DateTime.time(),
        gst_no: req.body.gst_no,
        otp: 1234,
        date_time: DateTime.date() + " " + DateTime.time(),
      };

      const user = new User(data_obj);
      var err = user.joiValidate(req.body);

      if (err.error) {
        var final = {
          res: "error",
          msg: err.error.details[0].message,
        };

        res.status(400).send(final);
      } else {
        if (status == "false") {
          var final = {
            res: "error",
            msg: "DL, GST, Form 20 certificate file is required!",
          };
          res.status(400).send(final);
        } else {
          user.save(function (err, doc) {
            if (err) {
              if (err.keyPattern) {
                if (err.keyPattern.email) {
                  var final = { 
                    res: "error",
                    msg: "This email already exist, try another!",
                    data: "",
                  };
                  res.status(400).send(final);
                } else if (err.keyPattern.mobile) {
                  var final = {
                    res: "error",
                    msg: "This mobile already exist, try another!",
                    data: "",
                  };
                  res.status(400).send(final);
                } else {
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
                  msg: "Something went wrong!",
                  data: [],
                };
                res.status(400).send(final);
              }
            } else {
              var final = {
                res: "success",
                msg: "Account created successfully!",
                data: doc,
              };
              res.status(201).send(final);
            }
          });
        }
      }
    } catch (e) {
      var final = {
        res: "error",
        msg: "Something went wrong!",
        data: [],
      };
      res.status(400).send(final);
    }
  }
);

module.exports = router;

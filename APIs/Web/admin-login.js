const express = require("express");
const router = express.Router();
const multer = require("multer");
const Admin = require("./../../models/Web/admin-login.schema");
const upload = multer();

router.post("/authenticate", upload.none(), function (req, res, next) {
  // res.end(req.body);
  try {
    const admin = new Admin(req.body);

    var err = admin.joiValidate(req.body);
    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      const email = req.body.email;
      const password = req.body.password;

      Admin.findOne({ email: email }, function (err, docs) {
        if (!err) {
          if (docs) {
            if (docs.password == password) {
              var final = {
                res: "success",
                msg: "Successfully logged in.",
                data: [docs],
              };
              res.status(200).send(final);
            } else {
              var final = {
                res: "error",
                msg: "Password is incorrect, enter valid one!",
              };
              res.status(400).send(final);
            }
          } else {
            var final = {
              res: "error",
              msg: "Email ID not exist!",
            };
            res.status(400).send(final);
          }
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

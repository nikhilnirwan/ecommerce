const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");

const { parse } = require("dotenv");
const upload = multer();

const Admin = require("./../../models/Web/admin-login.schema");

router.post("/admin-data", upload.none(), function (req, res, next) {
  Admin.findById("620e05ef4a66b914ff24c020", function (err, admin) {
    if (admin) {
      var final = {
        res: "success",
        msg: "Admin data found.",
        data: admin,
      };
      res.status(200).send(final);
    } else {
      var final = {
        res: "error",
        msg: "Something went wrong!",
        data: [],
      };
      res.status(400).send(final);
    }
  });
});

module.exports = router;

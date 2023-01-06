const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.get("/hello", upload.none(), function (req, res, next) {
  res.send("Hello World!");
});

module.exports = router;

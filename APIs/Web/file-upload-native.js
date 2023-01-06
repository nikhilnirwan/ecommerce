const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/native/" });

/*
-------------
File Upload Native - Dont't touch this snippet
-------------
*/

router.post(
  "/file-upload-native",
  upload.single("image"),
  function (req, res, next) {
    res.send(req.file);
  }
);

module.exports = router;

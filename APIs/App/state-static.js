const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const states_list = require("./state-dict.json");

router.get("/state-static", upload.none(), function (req, res, next) {
  // remove key  from array of object
  for (let i = 0; i < states_list.length; i++) {
    delete states_list[i].districts;
  }
  var final = {
    res: "success",
    msg: states_list.length + " state(s) found.",
    data: states_list,
  };

  res.status(200).send(final);
});

module.exports = router;

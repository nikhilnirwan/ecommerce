const express = require("express");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const District = require("./../../models/Web/district.schema");

const district_list = require("./state-dict.json");

const upload = multer();

router.post("/district-static", upload.none(), function (req, res, next) {
  const state = req.body.state;
  var dobject = "";
  for (let i = 0; i < district_list.length; i++) {
    if (district_list[i].state === state) {
      var dist_list = district_list[i].districts;
      console.log(dist_list);
      //create array of object from array javascript
      dobject = dist_list.map((item) => {
        return {
          district: item,
        };
      });
    }
  }

  var final = {
    res: "success",
    msg: dobject.length + " district(s) found.",
    data: dobject,
  };

  res.send(final);
});

module.exports = router;

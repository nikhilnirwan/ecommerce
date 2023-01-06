const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Address = require("./../../models/Web/address.schema");
const upload = multer();

const DateTime = require("./../../modules/date-time");

router.post("/delete-address", upload.none(), function (req, res, next) {
  try {
    var address_id = req.body.address_id;
    if (address_id) {
      Address.findById(address_id, function (err, address) {
        if (!address) {
          var final = {
            res: "error",
            msg: "Address ID is invalid!",
          };
          res.status(400).send(final);
        } else {
          //   delete address by id
          Address.findByIdAndDelete(address_id, function (err, result) {
            if (err) {
              res.send(err);
              var final = {
                res: "error",
                msg: "Something went wrong!",
                data: [],
              };
            } else {
              var final = {
                res: "success",
                msg: "Address deleted successfully!",
                data: [],
              };
              res.status(200).send(final);
            }
          });
        }
      });
    } else {
      var final = {
        res: "error",
        msg: "Address ID is required!",
      };
      res.status(400).send(final);
    }
  } catch (err) {
    var final = {
      res: "error",
      msg: "Something went wrong!",
    };
    res.status(400).send(final);
  }
});

module.exports = router;

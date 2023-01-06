const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");
const Wallet = require("./../../models/Web/wallet.schema");
const upload = multer();

router.post("/wallet-history", upload.none(), function (req, res, next) {
  const wallet = new Wallet(req.body);
  var err = wallet.walletHistory(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    // check if user_id is valid
    User.findById(req.body.user_id, function (err, user) {
      if (user) {
        Wallet.find(
          { user_id: req.body.user_id, txn_status: { $ne: "FAIELD" } },
          function (err, txns) {
            if (txns) {
              var final = {
                res: "success",
                msg: "Wallet history fetched successfully.",
                data: txns,
              };
              res.status(200).send(final);
            } else {
              var final = {
                res: "error",
                msg: "No transactions found!",
              };
              res.status(400).send(final);
            }
          }
        );
      } else {
        var final = {
          res: "error",
          msg: "User ID is invalid!",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const Cart = require("./../../models/Web/cart.schema");
const User = require("./../../models/Web/user.schema");
const { parse } = require("dotenv");
const upload = multer();
const Address = require("./../../models/Web/address.schema");

router.post("/mark-order-as-failed", upload.none(), function (req, res, next) {
  const order = new Order(req.body);
  var err = order.orderDetails(req.body);
  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    // find order by id and update
    Order.findByIdAndUpdate(req.body.order_id, {
      $set: {
        txn_status: "failed",
        order_status: "failed",
        remark:
          "Payment marked as failed, any amount debited will be refunded back in 72 hours.",
      },
    }).exec(function (err, doc) {
      if (doc) {
        var final = {
          res: "success",
          msg: "Order marked as failed.",
        };
        res.status(200).send(final);
      } else {
        var final = {
          res: "error",
          msg: "Something went wrong!",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

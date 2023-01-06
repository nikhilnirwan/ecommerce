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

router.post("/mark-order-as-cancel", upload.none(), function (req, res, next) {
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
        order_status: "cancelled",
        remark:
          "Your order can't be fulfilled due to some reason, so we are cancelling your order.",
      },
    }).exec(function (err, doc) {
      if (doc) {
        var final = {
          res: "success",
          msg: "Order cancelled successfully.",
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

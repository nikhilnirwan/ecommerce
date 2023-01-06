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

router.post(
  "/order-complete-details",
  upload.none(),
  function (req, res, next) {
    const order = new Order(req.body);
    var err = order.orderDetails(req.body);
    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      // verify user id
      Order.findById(req.body.order_id).exec(function (err, doc) {
        if (doc) {
          res.send(doc);
        } else {
          var final = {
            res: "error",
            msg: "Order ID is invalid!",
          };
          res.status(400).send(final);
        }
      });
    }
  }
);

module.exports = router;

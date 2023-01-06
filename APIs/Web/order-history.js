const { json } = require("express");
const e = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");

router.post(
  "/order-tracking-history",
  upload.none(),
  function (req, res, next) {
    const order = new Order(req.body);
    var err = order.cancelOrder(req.body);
    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      // verify order id
      Order.findOne({ _id: req.body.order_id }, function (err, order) {
        if (order) {
          Tracking.find({ order_id: order.order_id }, function (err, track) {
            if (track) {
              var final = {
                res: "success",
                msg: "Order tracking information found!",
                data: track,
              };
              res.status(200).send(final);
            } else {
              // no record found
              var final = {
                res: "error",
                msg: "No record found for this order!",
              };
              res.status(400).send(final);
            }
          });
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

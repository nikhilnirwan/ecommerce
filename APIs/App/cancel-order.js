const { json } = require("express");
const e = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");
const DateTime = require("./../../modules/date-time");

router.post("/cancel-order", upload.none(), function (req, res, next) {
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
    Order.findOne({ order_id: req.body.order_id }, function (err, order) {
      if (order) {
        if (order.order_status === "confirmed") {
          Order.findOneAndUpdate(
            { order_id: req.body.order_id },
            {
              order_status: "cancelled",
              remark: "Order cancelled from user end.",
            },
            { new: true },
            function (err, latest) {
              if (latest) {
                // create order tracking info to cancelled
                var data_object = {
                  order_status: "Cancelled",
                  message: "Order cancelled from user end.",
                  date_time: DateTime.date() + " " + DateTime.time(),
                };
                var tracking = new Tracking(data_object);
                tracking.save(function (err, track) {
                  if (latest) {
                    var final = {
                      res: "success",
                      msg: "Order cancelled successfully",
                      data: latest,
                    };
                    res.status(200).send(final);
                  } else {
                    var final = {
                      res: "error",
                      msg: "Something went wrong",
                    };
                    res.status(400).send(final);
                  }
                });
              } else {
                var final = {
                  res: "error",
                  msg: "Something went wrong",
                };
                res.status(400).send(final);
              }
            }
          );
        } else {
          var final = {
            res: "error",
            msg: "Order is not yet confirmed!",
          };
          res.status(400).send(final);
        }
      } else {
        var final = {
          res: "error",
          msg: "Order ID is invalid!",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

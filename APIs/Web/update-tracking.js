const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const { parse } = require("dotenv");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");
const DateTime = require("./../../modules/date-time");

router.post("/update-tracking-info", upload.none(), function (req, res, next) {
  //   console.log(req.body);
  var data_object = {
    order_id: req.body.order_id,
    order_status: req.body.status,
    message: req.body.msg,
    date_time: DateTime.date() + " " + DateTime.time(),
  };
  const track = new Tracking(data_object);
  var err = track.validateTrackingInfo(data_object);
  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    // find order by id
    Order.findOne({ order_id: req.body.order_id }, function (err, doc) {
      if (doc) {
        // find by status and order id
        Tracking.findOne(
          { order_id: req.body.order_id, order_status: req.body.status },
          function (err, result) {
            if (result) {
              var final = {
                res: "error",
                msg: "This status is already updated!",
              };
              res.status(400).send(final);
            } else {
              // save tracking data
              track.save(function (err, save) {
                if (save) {
                  // if staus in Delivered
                  if (req.body.status == "Delivered") {
                    // update order status
                    Order.findOneAndUpdate(
                      { order_id: req.body.order_id },
                      {
                        order_status: "delivered",
                        remark: "Order delivered successfully",
                      },
                      function (err, doc) {
                        if (doc) {
                          var final = {
                            res: "success",
                            msg: "Ordered marked as delivered.",
                            data: save,
                          };
                          res.status(200).send(final);
                        } else {
                          var final = {
                            res: "error",
                            msg: "Something went wrong!",
                          };
                          res.status(400).send(final);
                        }
                      }
                    );
                  }else if (req.body.status == "Packed"){
                  Order.findOneAndUpdate(
                      { order_id: req.body.order_id },
                      {
                        order_status: "packed",
                        remark: "Order packed and ready to ship.",
                      },
                      function (err, doc) {
                        if (doc) {
                          var final = {
                            res: "success",
                            msg: "Ordered marked as packed.",
                            data: save,
                          };
                          res.status(200).send(final);
                        } else {
                          var final = {
                            res: "error",
                            msg: "Something went wrong!",
                          };
                          res.status(400).send(final);
                        }
                      }
                    );
                  } else if(req.body.status == "Shipped"){
                    Order.findOneAndUpdate(
                      { order_id: req.body.order_id },
                      {
                        order_status: "shipped",
                        remark: "Order shipped.",
                      },
                      function (err, doc) {
                        if (doc) {
                          var final = {
                            res: "success",
                            msg: "Ordered marked as shipped.",
                            data: save,
                          };
                          res.status(200).send(final);
                        } else {
                          var final = {
                            res: "error",
                            msg: "Something went wrong!",
                          };
                          res.status(400).send(final);
                        }
                      }
                    );
                  }else {
                    var final = {
                      res: "success",
                      msg: "Tracking info updated successfully.",
                      data: save,
                    };
                    res.status(200).send(final);
                  }
                } else {
                  var final = {
                    res: "error",
                    msg: "Error in saving tracking data!",
                  };
                  res.status(400).send(final);
                }
              });
            }
          }
        );
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

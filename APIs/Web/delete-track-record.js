const express = require("express");
const { func } = require("joi");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Tracking = require("./../../models/Web/order-tracking.schema");
const Order = require("./../../models/Web/order.schema");

const upload = multer();

router.post("/delete-track-record", upload.none(), function (req, res, next) {
  const tracking = new Tracking(req.body);
  const err = tracking.deleteTrackingInfo(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
      data: [],
    };
    res.status(400).send(final);
  } else {
    //find and delete by id
 
    Tracking.findByIdAndDelete(req.body.tracking_id, function (err, docs) {
      if (docs) {
        if (req.body.status) {
          
          var order_status = "";
          var remark = "";
          
          if(req.body.status == "Delivered")
          {
              order_status = "shipped";
              remark = "Order shipped."
          }else if(req.body.status == "Shipped"){
              order_status = "packed";
              remark = "Order packed.";
          }else if(req.body.status == "Packed"){
              order_status = "confirmed";
              remark = "Order confirmed.";
          }
      
          // change order status to confirmed
          Order.findOneAndUpdate(
            { order_id: docs.order_id },
            {
              order_status: order_status,
              remark: remark,
            },
            function (err, docs) {
              if (docs) {
                var final = {
                  res: "success",
                  msg: "Tracking record deleted.",
                };
                res.status(200).send(final);
              } else {
                var final = {
                  res: "error",
                  msg: "Tracking record deleted, but order status not updated.",
                };
                res.status(400).send(final);
              }
            }
          );
        } else {
          var final = {
            res: "success",
            msg: "Tracking record deleted.",
          };
          res.status(200).send(final);
        }
      } else {
        var final = {
          res: "error",
          msg: "No data found.",
          data: [],
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

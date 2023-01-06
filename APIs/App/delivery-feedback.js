const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const Feedback = require("./../../models/Web/feedback.schema");
const { reset } = require("nodemon");
const upload = multer();

router.post("/delivery-feedback", upload.none(), function (req, res, next) {
  var delivery_feedback = new Feedback(req.body);
  var err = delivery_feedback.validateFeedback(req.body);
  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    //check if order id valid
    Order.findOne({ order_id: req.body.order_id }, function (err, order) {
      if (order) {
        if (order.order_status == "delivered") {
          //   check if feedback already exists
          Feedback.findOne(
            { order_id: req.body.order_id },
            function (err, data) {
              if (data) {
                var data_object = {
                  comment: req.body.feedback,
                  star_rating: req.body.star_rating,
                };
                Feedback.findOneAndUpdate(
                  { order_id: req.body.order_id },
                  data_object,
                  { new: true },
                  function (err, latest) {
                    if (latest) {
                      var final = {
                        res: "success",
                        msg: "Feedback updated successfully",
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
                  }
                );
              } else {
                var data_object = {
                  order_id: req.body.order_id,
                  comment: req.body.feedback,
                  star_rating: req.body.star_rating,
                  user_id: order.user_id,
                };

                Feedback.create(data_object, function (err, feedback) {
                  if (feedback) {
                    var final = {
                      res: "success",
                      msg: "Feedback submitted successfully",
                      data: feedback,
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
              }
            }
          );
        } else {
          var final = {
            res: "error",
            msg: "Order is not yet delivered!",
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

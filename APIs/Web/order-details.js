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
const Tracking = require("./../../models/Web/order-tracking.schema");

const GetUser = async (userid) => {
    // var current = DateTime.date();
    
    const user = await User.find({ _id: userid});
    return user[0];
}


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
      Order.findById(req.body.order_id)
        .populate("address")
        .populate("user_id")
        .exec(function (err, doc) {
          if (doc) {
            // get cart item by order id
            Cart.find({ order_id: doc.order_id }).exec(function (err, cart) {
              if (cart) {
                // get tracking info 
                Tracking.find({ order_id: doc.order_id }).exec(async function (
                  err,
                  track
                ) {
                  if (track) {
                    
                    const userdata = await GetUser(doc.user_id);
                  
                    var final = {
                      res: "success",
                      msg: "Order details found.",
                      data: doc,
                      ordered_items: cart,
                      address: doc.address,
                      tracking_info: track,
                      user_details: userdata
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
              } else {
                var final = {
                  res: "error",
                  msg: "No Item associated!",
                };
                console.log(final);
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

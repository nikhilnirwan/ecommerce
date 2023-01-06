const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const Cart = require("./../../models/Web/cart.schema");
const User = require("./../../models/Web/user.schema");
const { parse } = require("dotenv");
const upload = multer();

router.post("/order-history", upload.none(), function (req, res, next) {
    const order = new Order(req.body);
    var err = order.orderPreview(req.body);
    if (err.error) {
        var final = {
            res: "error",
            msg: err.error.details[0].message,
        };
        res.status(400).send(final);
        } else {
        // verify user id
        User.findById(req.body.user_id, function (err, user) {
            if (user) {
                  // get all order history
                  Order.find({ user_id: req.body.user_id })
                  .sort({_id:-1})
                  .exec({}, function(err, docs){
                      if(docs)
                      {
                          // loop through all order history
                          var dataitem = [];
                          docs.forEach(function (item) {
                              //get ordered items
                              var each = {
                                  user_id: item.user_id,
                                  order_id: item.order_id,
                                  shipping_charge: item.shipping_charge,
                                  subtotal: item.subtotal,
                                  amount: item.amount,
                                  method: item.method,
                                  txn_status: item.txn_status,
                                  order_status: item.order_status,
                                  address: item.address,
                                  ordered_item: [],
                                  remark: item.remark,
                                  date_time: item.date_time,
                              };
                              dataitem.push(each);
                          });
                          var final = {
                              res: "success",
                              msg: dataitem.length + " Order(s) found.",
                              data: dataitem,
                          };
                          res.status(200).send(final);
                      }
                      else
                      {
                          var final = {
                              res: "error",
                              msg: "No order history found.",
                          };
                          res.status(400).send(final);
                      }
                  });
                  
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

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
      Order.findOne({ order_id: req.body.order_id })
        .populate("address")
        .exec(function (err, doc) {
          if (doc) {
            //get cart item
            Cart.find(
              { order_id: req.body.order_id },
              async function (err, docs) {
                if (docs) {
                  // create an empty array
                  var cart_items = [];
                  // loop through all cart items
                  docs.forEach(function (item) {
                    // push each item to the array
                    // unstringify product_data
                    var product_data = JSON.parse(item.product_data);
                    var each = {
                      name: product_data.name,
                      mrp: product_data.mrp,
                      quantity: item.quantity,
                      offerprice: product_data.offerprice,
                      image1:
                        process.env.BASEURL +
                        "public/uploads/product/" +
                        product_data.image1,
                    };
                    cart_items.push(each);
                  });
                  var orderdata = JSON.parse(JSON.stringify(doc));
                  if(orderdata.order_status == "delivered")
                  {
                    orderdata.invoice = "https://edawai.vercel.app/OrderInvoice/"+orderdata._id;
                  }
                  else
                  {
                    orderdata.invoice = "";
                  } 
                  var final = {
                    res: "success",
                    msg: "Order details found.",
                    data: orderdata,
                    ordered_items: cart_items,
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

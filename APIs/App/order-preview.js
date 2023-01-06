const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const Cart = require("./../../models/Web/cart.schema");
const User = require("./../../models/Web/user.schema");
const { parse } = require("dotenv");
const upload = multer();

router.post("/order-preview", upload.none(), function (req, res, next) {
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
        Cart.find({
          user_id: req.body.user_id,
          status: false,
          order_id: "0",
        })
          .populate("product_id")
          .exec({}, function (err, docs) {
            //   delete product_data key
            var total = 0;
            var offer_total = 0;
            var delivery_charge = 40;
            var total_discount = 0;
            docs.forEach(function (doc) {
              total =
                parseInt(total) +
                parseInt(doc.product_id.mrp) * parseInt(doc.quantity);
              offer_total =
                parseInt(offer_total) +
                parseInt(doc.product_id.offerprice) * parseInt(doc.quantity);
              // total_discount =
              //   total_discount +
              //   (doc.product_id.mrp - doc.product_id.offer_price);
            });

            var final = {
              res: "success",
              msg: "Order preview fetched successfully.",
              data: {
                total_mrp: total,
                total_offer_price: offer_total,
                delivery_charge: delivery_charge,
                total_discount: total - offer_total,
                total_payable: offer_total + delivery_charge,
              },
            };

            res.status(200).send(final);
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

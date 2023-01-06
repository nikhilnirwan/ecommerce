const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Cart = require("./../../models/Web/cart.schema");
const Product = require("./../../models/Web/product.schema");
const upload = multer();

router.post("/cart-count", upload.none(), function (req, res, next) {
  const cart = new Cart(req.body);
  var err = cart.joiValidateUserId(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    Cart.find(
      { user_id: req.body.user_id, status: false, order_id: "0" },
      function (err, cart) {
        if (cart) {
          var final = {
            res: "success",
            msg: "Cart count",
            data: cart.length,
          };
          res.status(200).send(final);
        } else {
          var final = {
            res: "error",
            msg: "No data found in cart",
            data: 0,
          };
          res.status(400).send(final);
        }
      }
    );
  }
});

module.exports = router;

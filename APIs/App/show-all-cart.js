const express = require("express");
const router = express.Router();
const multer = require("multer");
const Cart = require("./../../models/Web/cart.schema");
const upload = multer();

router.post("/show-cart", upload.none(), function (req, res, next) {
  var data_obj = {
    user_id: req.body.user_id,
  };

  const cart = new Cart(data_obj);
  var err = cart.joiValidateUserId(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    //check if already in cart
    Cart.find({
      user_id: req.body.user_id,
      order_id: "0",
      status: false,
    })
      .populate("product_id")
      .populate({
        path: "product_id",
        populate: {
          path: "category",
        },
      })
      .populate({
        path: "product_id",
        populate: {
          path: "brand",
        },
      })
      .exec(
        {
          user_id: req.body.user_id,
          status: false,
          order_id: "0",
        },
        function (err, docs) {
          if (docs.length != 0) {
            // set image url
            var object = JSON.parse(JSON.stringify(docs));
            object.forEach(function (doc) {
              doc.product_id.image1 =
                process.env.BASEURL +
                "public/uploads/product/" +
                doc.product_id.image1;
              doc.count = 0;
            });
            
            var final = {
              res: "success",
              msg: docs.length + " product(s) found in cart.",
              data: object,
            };
            res.status(200).send(final);
          } else {
            var final = {
              res: "error",
              msg: "Cart is empty!",
            };
            res.status(400).send(final);
          }
        }
      );
  }
});

module.exports = router;

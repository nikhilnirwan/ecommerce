const express = require("express");
const router = express.Router();
const multer = require("multer");
const Wishlist = require("./../../models/Web/wishlist.schema");
const upload = multer();

router.post("/wishlist", upload.none(), function (req, res, next) {
  try {
    var data_obj = {
      user_id: req.body.user_id,
      product_id: req.body.product_id,
    };

    const cart = new Wishlist(data_obj);
    var err = cart.joiValidate(req.body);

    if (err.error) {
      var final = {
        res: "error",
        msg: err.error.details[0].message,
      };
      res.status(400).send(final);
    } else {
      //check if already in cart
      Wishlist.findOne(
        {
          user_id: req.body.user_id,
          product_id: req.body.product_id,
        },
        function (err, doc) {
          if (!doc) {
            cart.save(function (err, result) {
              if (err) {
                var final = {
                  res: "error",
                  msg: "Something went wrong!",
                };
                res.status(400).send(final);
              } else {
                var final = {
                  res: "success",
                  msg: "Added to wishlist.",
                  data: result,
                };
                res.status(200).send(final);
              }
            });
          } else {
            Wishlist.findOneAndDelete(
              {
                user_id: req.body.user_id,
                product_id: req.body.product_id,
              },
              function (err, result) {
                if (err) {
                  var final = {
                    res: "error",
                    msg: "Something went wrong!",
                  };
                  res.status(400).send(final);
                } else {
                  var final = {
                    res: "success",
                    msg: "Removed from wishlist!",
                  };
                  res.status(200).send(final);
                }
              }
            );
          }
        }
      );
    }
  } catch (err) {
    var final = {
      res: "error",
      msg: "Something went wrong!",
    };
    res.status(400).send(final);
  }
});

module.exports = router;

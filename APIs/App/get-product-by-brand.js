const express = require("express");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Product = require("./../../models/Web/product.schema");
var User = require("./../../models/Web/user.schema");
var Cart = require("./../../models/Web/cart.schema");
var Wishlist = require("./../../models/Web/wishlist.schema");
const filter = require("../../modules/filter-data");

const upload = multer();

router.post("/get-product-by-brand", upload.none(), function (req, res, next) {
  // check if not empty req.body.user_id
  try {
    if (req.body.user_id) {
      User.findById(req.body.user_id, function (err, doc) {
        if (doc) {
          if (req.body.brand_id) {
            const id = req.body.brand_id;
            Product.find({ brand: id, status:{$ne: false} })
              .populate("category")
              .populate("brand")
              .sort({ _id: -1 })
              .exec({}, async function (err, docs) {
                if (err) {
                  if (err.name == "CastError") {
                    var final = {
                      res: "error",
                      msg: "ID is not in proper format",
                      data: [],
                    };
                  } else {
                    var final = {
                      res: "error",
                      msg: "Something went wrong!",
                      data: [],
                    };
                  }
                  
                  res.status(400).send(final);
                } else {
                  //embed url with image
                  var object = JSON.parse(JSON.stringify(docs));
                  for (element of object) {
                    element.image1 =
                      process.env.BASEURL +
                      "public/uploads/product/" +
                      element.image1;
                    element.count = 0;
                    await Cart.findOne({
                      user_id: req.body.user_id,
                      product_id: element._id,
                      status: false,
                    })
                      .exec()
                      .then((doc) => {
                        if (doc) {
                          element.in_cart = true;
                          element.cart_count = doc.quantity;
                        } else {
                          element.in_cart = false;
                          element.cart_count = 0;
                        }
                      });

                    await Wishlist.findOne({
                      user_id: req.body.user_id,
                      product_id: element._id,
                    })
                      .exec()
                      .then((doc) => {
                        if (doc) {
                          element.in_wishlist = true;
                        } else {
                          element.in_wishlist = false;
                        }
                      });
                  }
                  var response = await filter.filterProductByForm(doc, object);
                  var final = {
                    res: "success",
                    msg: response.length + " product(s) found.",
                    data: response,
                  };
                  res.status(200).send(final);
                }
              });
          } else {
            var final = {
              res: "error",
              msg: "Brand ID filed should not be empty!",
              data: [],
            };
            res.status(400).send(final);
          }
        } else {
          var final = {
            res: "error",
            msg: "User ID entered is invalid!",
            data: [],
          };
          res.status(400).send(final);
        }
      });
    } else {
      if (req.body.brand_id) {
        const id = req.body.brand_id;
        try {
          Product.find({ brand: id })
            .populate("category")
            .populate("brand")
            .sort({ _id: -1 })
            .exec({}, function (err, docs) {
              if (err) {
                if (err.name == "CastError") {
                  var final = {
                    res: "error",
                    msg: "ID is not in proper format",
                    data: [],
                  };
                } else {
                  var final = {
                    res: "error",
                    msg: "Something went wrong!",
                    data: [],
                  };
                }

                res.status(400).send(final);
              } else {
                //embed url with image
                var object = JSON.parse(JSON.stringify(docs));
                object.forEach((element) => {
                  element.image1 =
                    process.env.BASEURL +
                    "public/uploads/product/" +
                    element.image1;
                  element.count = 0;
                });
                var final = {
                  res: "success",
                  msg: docs.length + " product(s) found.",
                  data: object,
                };
                res.status(200).send(final);
              }
            });
        } catch (e) {
          var final = {
            res: "error",
            msg: "Something went wrong!",
            data: [],
          };
          res.status(400).send(final);
        }
      } else {
        var final = {
          res: "error",
          msg: "Brand ID filed should not be empty!",
          data: [],
        };
        res.status(400).send(final);
      }
    }
  } catch (e) {
    var final = {
      res: "error",
      msg: "Something went wrong!",
      data: [],
    };
    res.status(400).send(final);
  }
});

module.exports = router;

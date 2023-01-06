const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("./../../models/Web/product.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();
const Cart = require("./../../models/Web/cart.schema");
const Wishlist = require("./../../models/Web/wishlist.schema");
const DateTime = require("./../../modules/date-time");
const filter = require("../../modules/filter-data");
router.post("/search-product", upload.none(), function (req, res, next) {
  //   try {
  // check if user is valid
  var user_id = req.body.user_id;

  // validate user
  User.findById(user_id, function (err, user) {
    if (user) {
      var data_object = {
        user_id: req.body.user_id,
        keyword: req.body.keyword,
      };
      const product = new Product(data_object);
      var err = product.searchProduct(req.body);
      if (err.error) {
        var final = {
          res: "error",
          msg: err.error.details[0].message,
        };

        res.status(400).send(final);
      } else {
        // search product by keyword
        Product.find(
          { name: { $regex: new RegExp(data_object.keyword, "i") } },
          async function (err, docs) {
            if (err) {
              res.send(err);
              var final = {
                res: "error",
                msg: "Something went wrong!",
                data: [],
              };
              res.status(400).send(final);
            } else {
              // update image url
              for (element of docs) {
                element.image1 =
                  process.env.BASEURL +
                  "public/uploads/product/" +
                  element.image1;

                //cart staus
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

                //cart staus
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
              var response = await filter.filterProductByForm(user, docs);
              var final = {
                res: "success",
                msg: response.length + " product found.",
                data: response,
              };
              res.status(200).send(final);
            }
          }
        );
      }
    } else {
      var final = {
        res: "error",
        msg: "User ID is not valid!",
      };
      res.status(400).send(final);
    }
  });
  //   } catch (err) {
  //     var final = {
  //       res: "error",
  //       msg: "Something went wrong!",
  //     };
  //     res.status(400).send(final);
  //   }
});

module.exports = router;

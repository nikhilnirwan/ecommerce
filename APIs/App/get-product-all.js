const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");
const Product = require("./../../models/Web/product.schema");
const Cart = require("./../../models/Web/cart.schema");
const Wishlist = require("./../../models/Web/wishlist.schema");
const filter = require("../../modules/filter-data");
const upload = multer();

router.post("/get-product-all", upload.none(), function (req, res, next) {
  // check if not empty req.body.user_id
  if (req.body) {
    User.findById(req.body.user_id, function (err, doc) {
      if (doc) {
        Product.find({status:{$ne: false}})
          .populate("category") 
          .populate("brand")
          .sort({ _id: -1 })
          .exec({}, async function (err, docs) {
            if (err) {
              var final = {
                res: "error",
                msg: "Something went wrong!",
                data: [],
              };
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
              
              //Get Product according to user form
              var userdata = doc;
              var all_product = object;
            
              var response = await filter.filterProductByForm(userdata, all_product);
                
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
          msg: "User ID enetered is invalid!",
          data: [],
        };
        res.status(400).send(final);
      }
    });
  } else {
    Product.find()
      .populate("category")
      .populate("brand")
      .sort({ _id: -1 })
      .exec({}, async function (err, docs) {
        if (err) {
          var final = {
            res: "error",
            msg: "Something went wrong!",
            data: [],
          };
          res.status(400).send(final);
        } else {
          //embed url with image
          var object = JSON.parse(JSON.stringify(docs));

          for (element of object) {
            element.image1 =
              process.env.BASEURL + "public/uploads/product/" + element.image1;
            element.count = 0;
          }
 
          var final = {
            res: "success",
            msg: docs.length + " product(s) found.",
            data: object,
          };
          res.status(200).send(final);
        }
      });
  }

  // } catch (e) {
  //   var final = {
  //     res: "error",
  //     msg: "Something went wrong!",
  //     data: [],
  //   };
  //   res.status(400).send(final);
  // }
});

module.exports = router;

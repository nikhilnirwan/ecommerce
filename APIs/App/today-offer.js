const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");
const Product = require("./../../models/Web/product.schema");
const Cart = require("./../../models/Web/cart.schema");
const Wishlist = require("./../../models/Web/wishlist.schema");
const Offer = require("./../../models/Web/offer.schema");
const filter = require("../../modules/filter-data");

const upload = multer();
 
router.post("/today-offer", upload.none(), function (req, res, next) {
  // check if not empty req.body.user_id
  if (req.body) {
    User.findById(req.body.user_id, function (err, doc) {
      if (doc) { 
        const userdata = doc;
        Offer.find()
          .populate("product")
          .limit(5) 
          .sort({ _id: -1})
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
              var items = [];
              for (item of docs) {
                items.push(item.product)
              }
              
              for (element of items) {
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
              var response = await filter.filterProductByForm(userdata, items);  
              var final = { 
                res: "success",
                msg: items.length + " product(s) found.",
                data: items,
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
  
      Offer.find({status:{$ne: false}})
      .populate("product")
      .limit(5)
      .sort({ _id: -1})
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
          var items = [];
          for(item of object){
            items.push(item.product);
          }
        
          for (element of items) {
            element.image1 =
              process.env.BASEURL + "public/uploads/product/" + element.image1;
            element.count = 0;
          }

          var final = {
            res: "success",
            msg: items.length + " product(s) found.",
            data: items,
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

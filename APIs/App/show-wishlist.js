const express = require("express");
const router = express.Router();
const multer = require("multer");
const Wishlist = require("./../../models/Web/wishlist.schema");
const upload = multer();

router.post("/show-wishlist", upload.none(), function (req, res, next) {
  var data_obj = {
    user_id: req.body.user_id,
  };

  const wishlist = new Wishlist(data_obj);
  var err = wishlist.joiValidateUserId(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    //check if already in wishlist
    Wishlist.find({ user_id: req.body.user_id })
      .populate("product_id")
      .exec(
        {
          user_id: req.body.user_id,
        },
        function (err, docs) {
          // update image url
  
          if (docs.length != 0) {
            // set image URL
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
              msg: docs.length + " product(s) found in wishlist.",
              data: object,
            };
            res.status(200).send(final);
          } else {
            var final = {
              res: "error",
              msg: "Wishlist is empty!",
            };
            res.status(400).send(final);
          }
        }
      );
  }
});

module.exports = router;

const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Order = require("./../../models/Web/order.schema");

router.post("/update-date-of-delivery", upload.none(), function (req, res, next) {
  const order = new Order(req.body);
  const err = order.joiValidateDelivery(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
      data: [],
    };
    res.status(400).send(final);
  } else {
    //find brand by id
    Order.findById(req.body.id, function (err, result) {
      if (result) {
      
        // update product status
        Order.findByIdAndUpdate(
          req.body.id,
          { delivery_by: req.body.date },
          { new: true },
          function (err, result) {
            if (result) {
              var msg = "";
            
                msg = "Delivery Date updated successfully.";
            
              var final = {
                res: "success",
                msg: msg,
                data: result,
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
          msg: "Invalid Order ID!",
          data: [],
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

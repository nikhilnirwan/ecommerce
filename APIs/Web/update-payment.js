const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const { parse } = require("dotenv");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");
const DateTime = require("./../../modules/date-time");

router.post("/update-payment", upload.none(), function (req, res, next) {
  //   console.log(req.body);
 
  const order = new Order(req.body);
  var err = order.joiUpdatePayment(req.body);
  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    Order.findOne({ _id: req.body.id }, function (err, doc) {
      if (doc) {
		var status = req.body.status;
		
		if(status == "done")
		{
			status = "success";
		}
		else
		{
			status = "pending";
		}
		
		 
        Order.findByIdAndUpdate(req.body.id, {txn_status: status}, function(err, doc){
			if(doc)
			{
				 var final = {
					  res: "success",
					  msg: "Payment status updated successfully.", 
					  status: status
					};
					res.status(200).send(final);
			}
			else
			{
				 var final = {
				  res: "error",
				  msg: "Something went wrong!",
				  status: "0"
				};
				res.status(400).send(final);
			}
		});
      } else {
        var final = {
          res: "error",
          msg: "Order ID is invalid!",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

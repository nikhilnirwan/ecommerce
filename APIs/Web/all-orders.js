const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Order = require("./../../models/Web/order.schema");

router.post("/all-order", upload.none(), function (req, res, next) {
  var order_status = "";

  if (req.body) {
    order_status = req.body.order_status;
  } else {
  }
  var where = {};
  if (order_status) {
    where = {
      order_status: order_status,
    };
  }


  Order.find(where)
    .sort({ _id: -1 })
    .populate("user_id")
    .exec({}, function (err, result) {
      if (result) {
        var result = JSON.parse(JSON.stringify(result));
        
        var result_new = [];
        
        var adddata = "";
        result.map((item)=>{
        
            if(item.address_data)
            {
              adddata = JSON.parse(item.address_data);
              item.deliver_to = adddata.name; 
              item.delivery_contact = adddata.mobile; 
              item.delivery_address = adddata.address; 
              item.delivery_apartment = adddata.apartment_no; 
              item.delivery_city = adddata.city; 
              item.delivery_state = adddata.state; 
              item.delivery_landmark = adddata.landmark; 
              item.delivery_pincode = adddata.pincode; 
            }
            else
            {
              item.deliver_to = ""; 
              item.delivery_contact = ""; 
              item.delivery_address = ""; 
              item.delivery_apartment = ""; 
              item.delivery_city = ""; 
              item.delivery_state = ""; 
              item.delivery_landmark = ""; 
              item.delivery_pincode = ""; 
            }
            if(item.user_id)
            {  
              result_new.push(item);
            }
        })
      
        var final = {
          res: "success",
          msg: result_new.length + " Order found!",
          data: result_new,
        };
        res.status(200).send(final);
      } else {
        var final = {
          res: "error",
          msg: "Something went wrong!",
        };
        res.status(400).send(final);
      }
    });
});

module.exports = router;

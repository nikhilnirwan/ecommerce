const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const User = require("./../../models/Web/user.schema");

const Order = require("./../../models/Web/order.schema");


const GetOrderByUserId = async (userid) => {
  const order = await Order.findOne({ user_id: userid }).sort({ _id: -1 });
  var last_order = "";
  if (order) {
    last_order = order.date_time;
  }
  return last_order;
}

const GetOrderCount = async (userid) => {
  const order = await Order.find({ user_id: userid }).sort({ _id: -1 });
  var total_order = 0;
  if (order) {
    total_order = order.length;
  }
  return total_order;
}

router.post("/users", upload.none(), async function (req, res, next) {
  var user_status = "";

  if (req.body) {
    user_status = req.body.user_status;
  } else {
  }
  var where = {};

  if (user_status) {
    where = {
      appr_status: user_status,
    };
  }

  User.find(where)
    .sort({ _id: -1 })
    .exec({}, async function (err, result) {
      if (result) {
        
        const all_obj = JSON.parse(JSON.stringify(result));
        
        for(ele of all_obj)
        {
          ele.total_order = await GetOrderCount(ele._id);
          ele.last_order = await GetOrderByUserId(ele._id);
          
          if(ele.appr_status == "true")
          {
              ele.approval_status = "approved";
          }
          else
          {
            ele.approval_status = "pending";
          }
          
        }
      
        var final = {
          res: "success",
          msg: all_obj.length + " Users found!",
          data: all_obj,
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

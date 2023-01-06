const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const DateTime = require("./../../modules/date-time");
    

const User = require("./../../models/Web/user.schema");

const Order = require("./../../models/Web/order.schema");

//List of all user
const AllUser = async (status) => {
  if(status == "all")
  {
    var users = await User.find({}).sort({ _id: -1 });
  }
  else if(status == "active")
  { 
    var users = await User.find({appr_status:"true"}).sort({ _id: -1 });
  }
  
  return users;
}

//Last 7 Day date 
const DateBefore = (day) => { 
    var date = new Date();
    var last_days = new Date(date.setDate(date.getDate() - day));
    var last_days_str = last_days.toISOString().split("T")[0];
    last_days_str = last_days_str.replaceAll('-', '/');
    return last_days_str;
}

const CheckLast7Day = async (user_id) => {
  const orders = await Order.find({user_id: user_id})
  var last7day_date = await DateBefore(7);

  var list = [];
  var date_order = "";
  var date_comp = "";
  var orderdate = "";
  date_comp = new Date(last7day_date);
  for(element of orders)
  {
    orderdate = element.date_time;
    orderdate = orderdate.split(' ')[0];
    
    date_order = new Date(orderdate);
    
    
    if(date_order > date_comp)
    {
        return false;
    }
  }
  
  return true;
}


const CheckLast15Day = async (user_id) => {
  const orders = await Order.find({user_id: user_id})
  var last15day_date = await DateBefore(15);

  var list = [];
  var date_order = "";
  var date_comp = "";
  var orderdate = "";
  date_comp = new Date(last15day_date);
  for(element of orders)
  {
    orderdate = element.date_time;
    orderdate = orderdate.split(' ')[0];
    
    date_order = new Date(orderdate);
    
    
    if(date_order > date_comp)
    {
        return false;
    }
  }
  
  return true;
}


const CheckLast30Day = async (user_id) => {
  const orders = await Order.find({user_id: user_id})
  var last30day_date = await DateBefore(30);

  var list = [];
  var date_order = "";
  var date_comp = "";
  var orderdate = "";
  date_comp = new Date(last30day_date);
  for(element of orders)
  {
    orderdate = element.date_time;
    orderdate = orderdate.split(' ')[0];
    
    date_order = new Date(orderdate);
    
    
    if(date_order > date_comp)
    {
        return false;
    }
  }
  
  return true;
}

const CheckLast60Day = async (user_id) => {
  const orders = await Order.find({user_id: user_id})
  var last60day_date = await DateBefore(60);
  
  var list = [];
  var date_order = "";
  var date_comp = "";
  var orderdate = "";
  date_comp = new Date(last60day_date);
  for(element of orders)
  {
    orderdate = element.date_time;
    orderdate = orderdate.split(' ')[0];
    
    date_order = new Date(orderdate);
    
    
    if(date_order > date_comp)
    {
        return false;
    }
  }
  
  return true;
}
  
//Get no. of order by a user
const GetOrderCount = async (userid) => {
  const order = await Order.find({ user_id: userid }).sort({ _id: -1 });
  var total_order = 0;
  if (order) {
    total_order = order.length;
  }
  return total_order;
}

//Get last order date of user
const GetOrderByUserId = async (userid) => {
  const order = await Order.findOne({ user_id: userid }).sort({ _id: -1 });
  var last_order = "";
  if (order) {
    last_order = order.date_time;
  }
  return last_order;
}

router.post("/user-filter", upload.none(), async function (req, res, next) {
  if(req.body)
  {
    const user = new User(req.body);
    const err = user.joiValidateFilter(req.boy);
     
     if (err.error) {
        var final = {
            res: "error",
            msg: err.error.details[0].message,
        };
        res.status(400).send(final);
    } else {    
      if(req.body.filter && req.body.status)
      {
          const filter  = req.body.filter; 
          var users = await AllUser(req.body.status);
          users = JSON.parse(JSON.stringify(users));
          
          if(filter === "no_order")
          {
            
            /*
            - No order history. 
            */
            
            var list = [];
            
            for(element of users)
            {
              var check = await GetOrderCount(element._id); 
              
              if(check == 0)
              {
                element.total_order = await GetOrderCount(element._id);
                element.last_order = await GetOrderByUserId(element._id);
                list.push(element);
              }
            }
            var final = {
              res: "success",
              msg: list.length + " Users found!",
              filter: "Showing users - Signup but not ordered.",
              data: list,
            };
            res.status(200).send(final);
          }else if(filter === "last_7_days")
          {
              
            /*
            - Not ordered from last 7 days. 
            */
      
            var list = [];
            var check = "";
            for(element of users)
            {
              check = await CheckLast7Day(element._id);
               
              if(check)
              {
                  if(element.name)
                  {
                    element.total_order = await GetOrderCount(element._id);
                    element.last_order = await GetOrderByUserId(element._id);
                    list.push(element);
                  }
              }
            }
             
            var final = {
              res: "success",
              msg: list.length + " Users found!",
              filter: "Showing users - Not ordered from last 7days",
              data: list,
            };
            res.status(200).send(final);
          }
          else if(filter === "last_15_days")
          {
            /*
            - Not ordered from last 15 days. 
            */
      
            var list = [];
            var check = "";
            for(element of users)
            {
              check = await CheckLast15Day(element._id);
              
              if(check)
              {
                if(element.name)
                {
                  element.total_order = await GetOrderCount(element._id);
                  element.last_order = await GetOrderByUserId(element._id);
                  list.push(element);
                } 
              }
            }
             
            var final = {
              res: "success",
              msg: list.length + " Users found!",
              filter: "Showing users - Not ordered from last 15 days",
              data: list,
            };
            res.status(200).send(final);
          }
          else if(filter === "last_30_days")
          {
            /*
            - Not ordered from last 30 days. 
            */
      
            var list = [];
            var check = "";
            for(element of users)
            {
              check = await CheckLast30Day(element._id);
              
              if(check)
              {
                if(element.name)
                {
                  element.total_order = await GetOrderCount(element._id);
                  element.last_order = await GetOrderByUserId(element._id);
                  list.push(element);
                }
              }
            }
             
            var final = {
              res: "success",
              msg: list.length + " Users found!",
              filter: "Showing users - Not ordered from last 30 days",
              data: list,
            };
            res.status(200).send(final);
          }
          else if(filter === "last_60_days")
          {
            /*
            - Not ordered from last 60 days. 
            */
        
            var list = [];
            var check = "";
            for(element of users)
            {
              check = await CheckLast60Day(element._id);
              if(check) 
              { 
                if(element.name)
                {
                  element.total_order = await GetOrderCount(element._id);
                  element.last_order = await GetOrderByUserId(element._id);
                  list.push(element);
                }
              }
            }
             
            var final = {
              res: "success",
              msg: list.length + " Users found!",
              filter: "Showing users - Not ordered from last 60 days",
              data: list,
            };
            res.status(200).send(final);
          }
          else
          {
          
            var final = {
              res: "error",
              msg: "No such filter exist!"
            }
            res.status(400).send(final);
          }
      }
      else
      {
        var final = {
          res: "error",
          msg: "Filter is required!"
        }
        res.status(400).send(final);
      }
    }
  }
  else
  {
    var final = {
      res: "error",
      msg: "Request body should'nt be empty!"
    }
    res.status(400).send(final);
  }
});

module.exports = router;

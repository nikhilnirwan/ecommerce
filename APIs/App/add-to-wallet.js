const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Wallet = require("./../../models/Web/wallet.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();
const DateTime = require("../../modules/date-time");

// cashfree modules
const cashfree = require("./../../modules/cashfree");

router.post("/add-to-wallet", upload.none(), function (req, res, next) {
  // try {
    var userid = req.body.user_id;
    if (userid) {
      // check user
      User.findById(userid, function (err, user) {
        if (user) {
          // if userid is okay
          var oid = "ODW_" + Math.floor(+new Date() / 1000);
          const amount = req.body.amount;
          var data_object = { 
            user_id: req.body.user_id,
            amount: parseInt(req.body.amount) + parseInt(req.body.coupon_discount),
            order_id: oid,
            txn_type: "CREDIT",
            txn_status: "PENDING",
            remark: "Add money to wallet",
            date_time: DateTime.date() + " " + DateTime.time(),
            coupon_code: req.body.coupon_code,
            coupon_discount: req.body.coupon_discount
          }; 
          
          console.log("@@@@@@@@@");
          console.log(data_object);
          console.log("@@@@@@@@@");
 
          const wallet = new Wallet(data_object);
          var err = wallet.joiValidate(req.body);

          if (err.error) {
            var final = {
              res: "error",
              msg: err.error.details[0].message,
            };
            res.status(400).send(final);
          } else {
            // add to wallet and send token
            wallet.save(data_object, async function (err, wallet) {
              //   res.send(err);
              if (wallet) {
                req.body.coupon_discount = parseInt(req.body.coupon_discount);
                const cfdata = await cashfree.generateToken(oid, parseInt(req.body.amount));
                const cftoken = cfdata.data.cftoken;
                // append key cftoken in order object
                const details = {
                  app_id: process.env.CF_CLIENT_ID,
                  order_id: oid,
                  order_amount: req.body.amount,
                  app_secret: process.env.CF_CLIENT_SECRET,
                  cftoken: cftoken,
                  mode: process.env.Mode,
                  user_id: userid,
                };
              
                console.log(req.body);
                console.log(details);
                
                wallet.cftoken = cftoken;
                var final = {
                  res: "success",
                  msg: "Request created successfully, pay now.",
                  data: details,
                };

                res.status(200).send(final);
              } else {
                var final = {
                  res: "error",
                  msg: "Something went wrong1!",
                  data: [],
                };
                res.status(400).send(final);
              }
            });
          }
        } else {
          var final = {
            res: "error",
            msg: "User ID is not valid!",
          };
          res.status(400).send(final);
        }
      });
    } else {
      var final = {
        res: "error",
        msg: "User ID is not valid!",
      };
      res.status(400).send(final);
    }
  // } catch (err) {
    // var final = {
      // res: "error",
      // msg: "Something went wrong!",
    // };
    // res.status(400).send(final);
  // }
});

module.exports = router;

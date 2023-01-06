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

const Redeem = require("./../../models/Web/redeem.schema");

router.post(
  "/payment-response-wallet",
  upload.none(),
  function (req, res, next) {

    // try {
    var order_id = req.body.order_id;
    if (order_id) {
      // check user
      Wallet.find({ order_id: order_id }, function (err, wallet) {
        if (wallet) {
          // if userid is okay

          if (req.body.txn_status == "SUCCESS") {
            var data_object = {
              txn_status: "SUCCESS",
              cf_bundle: JSON.stringify(req.body.cf_bundle),
            };
          } else {
            var data_object = {
              txn_status: "FAILED",
              cf_bundle: JSON.stringify(req.body.cf_bundle),
            };
          }

          const uwallet = new Wallet(data_object);
          var err = uwallet.responseValidate(req.body);

          if (err.error) {
            var final = {
              res: "error",
              msg: err.error.details[0].message,
            };
            res.status(400).send(final);
          } else {
            Wallet.findOne(
              {
                order_id: order_id,
              },
              function (err, wallet) {
                if (wallet) {
                  if (wallet.txn_status == "PENDING") {
                    // update wallet TXN
                    Wallet.findOneAndUpdate(
                      {
                        order_id: order_id,
                      },
                      data_object,
                      {
                        new: true,
                      },
                      function (err, doc) {
                        if (doc) {
                          
                          // udate wallet balance
                          if (req.body.txn_status == "SUCCESS") {
                            
                            const user_id = req.body.user_id;
                            
                            // get userdata
                            User.findById(user_id, async function (err, user) {
                              if (user) {
                                console.log(wallet);
                                console.log('999999999999');
                                if(wallet.coupon_code != "")
                                {
                                    //create redemption record
                                    var redeem_obj = {
                                      coupon_code: wallet.coupon_code,
                                      user_id: wallet.user_id,
                                      discount: wallet.coupon_discount,
                                      date: DateTime.date(),
                                      time: DateTime.time(),
                                      coupon_type: "wallet"
                                    }; 
                                    const redeem = new Redeem(redeem_obj);
                                  
                                    await redeem.save(redeem_obj);
                                }
                              
                                var amount = user.wallet;

                                var data_obj = {
                                  wallet:
                                    parseInt(amount) + parseInt(wallet.amount),
                                }; 
                                
                                console.log(data_obj);
                                console.log('999999999999');
                                
                                await User.findByIdAndUpdate(
                                  user_id,
                                  data_obj,
                                  { new: true },
                                  function (err, user) {
                                    
                                  }
                                );
                              }
                            });
                            var msg = "Payment success, money added to wallet.";
                            var status = "success";
                            // update user wallet
                          } else {
                            var msg = "Payment failed.";
                            var status = "error";
                          }

                          var final = {
                            res: status,
                            msg: msg,
                            data: doc,
                          };
                          res.status(200).send(final);
                        } else {
                          var final = {
                            res: "error",
                            msg: "Payment failed.",
                          };
                          res.status(400).send(final);
                        }
                      }
                    );
                  } else {
                    var final = {
                      res: "error",
                      msg: "This Order is already updated!",
                    };
                    res.status(400).send(final);
                  }
                }
              }
            );
          }
        } else {
          var final = {
            res: "error",
            msg: "Order ID is invalid!",
          };
          res.status(400).send(final);
        }
      });
    } else {
      var final = {
        res: "error",
        msg: "Order ID is not valid!",
      };
      res.status(400).send(final);
    }
    // } catch (err) {
    //   var final = {
    //     res: "error",
    //     msg: "Something went wrong!",
    //   };
    //   res.status(400).send(final);
    // }
  }
);

module.exports = router;

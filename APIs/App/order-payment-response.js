const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const Cart = require("./../../models/Web/cart.schema");
const Product = require("./../../models/Web/product.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");
// cashfree modules
const cashfree = require("./../../modules/cashfree");
const Wallet = require("./../../models/Web/wallet.schema");

const DateTime = require("./../../modules/date-time");
const Redeem = require("./../../models/Web/redeem.schema");

router.post(
    "/order-payment-response",
    upload.none(),
    function (req, res, next) {
        const order = new Order(req.body);
        var err = order.UpdateOrder(req.body);
        
        if (err.error) {
            var final = {
                res: "error",
                msg: err.error.details[0].message,
            };
            res.status(400).send(final);
            } else {
            //   check if user is valid
            User.findById(req.body.user_id, function (err, user) {
                if (user) {
                    // verify order id
                    Order.findOne({ order_id: req.body.order_id }, function (err, order) {
                        if (order) {
                            if (order.order_status == "pending") {
                                var data_object = {
                                    txn_status: req.body.txn_status,
                                    cf_bundle: req.body.cf_bundle,
                                    txn_id: req.body.txn_id
                                };
                                
                                if (req.body.txn_status == "SUCCESS") {
                                    data_object.txn_status = "success";
                                    data_object.order_status = "confirmed";
                                    data_object.remark = "Payment received, order confirmed.";
                                    } else {
                                    data_object.txn_status = "failed";
                                    data_object.order_status = "failed";
                                    data_object.remark = "Payment failed.";
                                }
                                
                                // update order
                                Order.findOneAndUpdate(
                                    {
                                        order_id: req.body.order_id,
                                    },
                                    data_object,
                                    {
                                        new: true,
                                    },
                                    async function (err, result) {
                                        if (result) {
                                            
                                            
                                            if (req.body.txn_status == "SUCCESS") {
                                                var tracking_record = {
                                                    order_id: order.order_id,
                                                    order_status: "Order Confirmed",
                                                    message: "Your payment received & order is confirmed.",
                                                    delivery_by: "",
                                                    date_time: DateTime.date() + " " + DateTime.time(),
                                                };
                                                // create order tracking
                                                const tracking = new Tracking(tracking_record);
                                                tracking.save(tracking_record);
                                            }
                                            
                                            if (req.body.txn_status == "SUCCESS") {
                                                
                                                if(order.coupon_code != "0")
                                                {
                                                    //create redemption record
                                                    var redeem_obj = {
                                                      coupon_code: order.coupon_code,
                                                      user_id: order.user_id,
                                                      discount: order.coupon_discount,
                                                      date: DateTime.date(),
                                                      time: DateTime.time()
                                                    }; 
                                                    
                                                    const redeem = new Redeem(redeem_obj);
                                                  
                                                    await redeem.save(redeem_obj);
                                                }
                                               
                                                //do this procdure when order is SUCCESS
                                                if (result.paid_from_wallet != 0) {
                                                    var wallet_object = {
                                                        user_id: result.user_id,
                                                        order_id: result.order_id,
                                                        amount: result.paid_from_wallet,
                                                        txn_type: "DEBIT",
                                                        remark:
                                                        "Amount debited against order #" +
                                                        result.order_id +
                                                        ".",
                                                        date_time: DateTime.date() + " " + DateTime.time(),
                                                        txn_status: "SUCCESS",
                                                    };
                                                    
                                                    const wallet = new Wallet(wallet_object);
                                                    wallet.save(wallet_object);
                                                    
                                                    // update user wallet
                                                    var new_wallet = user.wallet - result.paid_from_wallet;
                                                    
                                                    User.updateOne(
                                                        { _id: result.user_id },
                                                        { wallet: new_wallet },
                                                        function (err, userdata) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                        }
                                                    );
                                                }
                                            } 
                                            
                                            if (data_object.order_status == "confirmed") {
                                                
                                                //find cart item by order id
                                                Cart.find({ order_id: result.order_id }, function (err, docs) {
                                                    if (docs) {
                                                        // decrease product stock  - for confirmed order only
                                                        for (element of docs) {
                                                            // find prooduct 
                                                            Product.findById(element.product_id, async function (
                                                                err,
                                                                product
                                                                ) {
                                                                if (product) {
                                                                    // update product stock
                                                                    var new_stock = product.stock - element.quantity;
                                                                    // check if new_stock is negatie
                                                                    if (new_stock < 0) {
                                                                        new_stock = 0;
                                                                    }
                                                                    await Product.updateOne(
                                                                        { _id: element.product_id },
                                                                    { stock: new_stock })
                                                                }
                                                            });
                                                        }
                                                    }
                                                })
                                                
                                                
                                            }
                                            if (req.body.txn_status == "SUCCESS") {
                                                var final = {
                                                    res: "success",
                                                    msg: "Order Success, Thank you for shopping with us.",
                                                    data: result,
                                                };
                                                res.status(200).send(final);
                                            }
                                            else
                                            {
                                                var final = {
                                                    res: "error",
                                                    msg: "Order Failed, Payment not received!.",
                                                    data: result,
                                                };
                                                res.status(400).send(final);
                                            }
                                            
                                            } else {
                                            var final = {
                                                res: "error",
                                                msg: "Something went wrong!",
                                            };
                                            res.status(200).send(final);
                                        }
                                    }
                                );
                                } else {
                                var final = {
                                    res: "error",
                                    msg: "Order already processed!",
                                };
                                res.status(400).send(final);
                            }
                            } else {
                            var final = {
                                res: "error",
                                msg: "Order ID is invalid, !",
                            };
                            res.status(400).send(final);
                        }
                    });
                    } else {
                    var final = {
                        res: "error",
                        msg: "User ID is invalid!",
                    };
                    res.status(400).send(final);
                }
            });
        }
    }
);

module.exports = router;

const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const Cart = require("./../../models/Web/cart.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");
const Wallet = require("./../../models/Web/wallet.schema");
const Address = require("./../../models/Web/address.schema");
const Redeem = require("./../../models/Web/redeem.schema");

const Product = require("./../../models/Web/product.schema");

// cashfree modules
const cashfree = require("./../../modules/cashfree");

const DateTime = require("./../../modules/date-time");
const { equal } = require("joi");

router.post("/checkout", upload.none(), function (req, res, next) {
    try {
        console.log(req.body);
        var userid = req.body.user_id;
        if (userid) {
            // check user
            User.findById(userid, function (err, user) {
                if (user) {
                    if(user.reject_status == "true")
                    {
                        var final = {
                            res: "error",
                            msg: "Your Account is rejeted please update your documents first before checkout!",
                            };
                        res.status(400).send(final);
                    }
                    else
                    {
                        Cart.find({ user_id: userid, order_id: "0", status: "false" })
                        .populate("product_id")
                        .exec(async function (err, docs) {
                            if (docs.length) {
                                // get subtotal
                                var subtotal = 0;
                                var shipping = 40;
                                for (element of docs) {
                                    var subtotal =
                                    parseInt(subtotal) +
                                    parseInt(element.product_id.offerprice * element.quantity);
                                }
                                
                                // genrating order id
                                var oid = "OD_" + Math.floor(+new Date() / 1000);
                                
                                var finalamount = shipping + subtotal;
                                var txn_status = "pending";
                                var wallet_record = "false";
                                
                                if (req.body.method != "cod") {
                                    // if order is not COD
                                    if (req.body.wallet_status == "true") {
                                        //user wants to use wallet
                                        if (finalamount <= user.wallet) {
                                            // all amount can be deducted from wallet
                                            // wallet record is also required
                                            // txn will be success and money will be debited from wallet
                                            wallet_record = "true";
                                            txn_status = "success";
                                            var order_status = "confirmed";
                                            var remark = "Order confirmed.";
                                            } else {
                                            // if order amount greater then wallet amount
                                            // then some amount from wallet will be deducted and some money will be paid online
                                            // order wil be pending untill confirmation from payment gateway is received
                                            var order_status = "pending";
                                            var remark = "Payment not received yet.";
                                        }
                                        } else {
                                        //user dont want to user wallet then set order status pending
                                        var order_status = "pending";
                                        var remark = "Payment not received yet.";
                                    }
                                    } else {
                                    // if order is COD
                                    txn_status = "pending";
                                    var order_status = "confirmed";
                                    var remark = "Payment not received yet.";
                                }
                                
                                // decision statement for how much money will be debited and from where
                                var wallet_paid = 0;
                                var online_paid = 0;
                                if (req.body.method != "cod") {
                                    // if order is not COD 
                                    if (req.body.wallet_status == "true") {
                                        // if user willing to pay from wallet as well
                                        if (finalamount > user.wallet) {
                                            // if order amount greater than wallet amount
                                            //then some amount from wallet will be deducted and some money will be paid online
                                            // order wil be pending untill confirmation from payment gateway is received
                                            //record for wallet debit will be created once confirmation received from payment gateway
                                            wallet_paid = user.wallet;
                                            online_paid = finalamount - user.wallet;
                                            wallet_record = "true";
                                            } else {
                                            wallet_paid = finalamount;
                                            wallet_record = "true";
                                        }
                                        } else {
                                        // user is not willing to pay from wallet so all money will be debited online
                                        // order wil be pending untill confirmation from payment gateway is received
                                        
                                        txn_status = "pending";
                                        order_status = "pending";
                                        remark = "Payment not received yet.";
                                        wallet_record = "false";
                                        
                                        wallet_paid = 0;
                                        online_paid = finalamount;
                                    }
                                    } else {
                                    wallet_record = "false";
                                    wallet_paid = 0;
                                    online_paid = finalamount;
                                }
                                
                                var address_id = req.body.address;
                                Address.findById(address_id, function (err, address) {
                                    if (address) { 
                                        var address_string = JSON.stringify(address);
                                        var data_object = {
                                            user_id: req.body.user_id,
                                            order_id: oid,
                                            shipping_charge: shipping,
                                            subtotal: subtotal,
                                            paid_from_wallet: wallet_paid,
                                            paid_online: online_paid,
                                            amount: finalamount - req.body.coupon_discount,
                                            method: req.body.method,
                                            txn_status: txn_status,
                                            order_status: order_status,
                                            discount: 0,
                                            address: req.body.address,
                                            address_data: address_string,
                                            remark: remark,
                                            date_time: DateTime.date() + " " + DateTime.time(),
                                            coupon_discount: req.body.coupon_discount,
                                            coupon_code: req.body.coupon_code,
                                        };
                                        
                                        
                                        const order = new Order(data_object);
                                        var err = order.joiValidate(req.body);
                                        if (err.error) {
                                            var final = {
                                                res: "error",
                                                msg: err.error.details[0].message,
                                            };
                                            
                                            res.status(400).send(final);
                                            } else {
                                            order.save(data_object, async function (err, order) {
                                                console.log('------------------');
                                                console.log(err); 
                                                console.log('------------------');
                                                if (order) {
                                                    //update cart staus to true
                                                    for (element of docs) {
                                                        await Cart.findOneAndUpdate(
                                                            { _id: element._id },
                                                            { status: true, order_id: oid }
                                                        );
                                                    }
                                                    const amount = shipping + subtotal;
                                                    
                                                    if (data_object.method != "cod") {
                                                        /*
                                                            Cashfree token genration - for online payment
                                                        */
                                                        var mode = process.env.Mode;
                                                        const cfdata = await cashfree.generateToken(
                                                            oid,
                                                            amount
                                                        );
                                                        var cftoken = cfdata.data.cftoken;
                                                        order.cftoken = cftoken;
                                                        if (process.env.Mode == "Test") {
                                                            var app_id = process.env.CF_CLIENT_ID;
                                                            } else {
                                                            var app_id = process.env.Live_CF_CLIENT_ID;
                                                        }
                                                        
                                                        var msg =
                                                        "Order created successfully, pay now to complete.";
                                                        } else {
                                                        // for cod payment
                                                        
                                                        var app_id = "";
                                                        var cftoken = "";
                                                        var mode = "";
                                                        var msg =
                                                        "Order placed successfully, thank you for shoping with us .";
                                                        
                                                        // order tracking record
                                                        var tracking_record = {
                                                            order_id: oid,
                                                            order_status: "Order Confirmed",
                                                            message: "Your COD order is confirmed.",
                                                            delivery_by: "",
                                                            date_time:
                                                            DateTime.date() + " " + DateTime.time(),
                                                        };
                                                        
                                                        // create order tracking
                                                        const tracking = new Tracking(tracking_record);
                                                        tracking.save(tracking_record);
                                                    }
                                                    
                                                    var cashfree_token = cftoken;
                                                    var cashfree_app = app_id;
                                                    if (order.amount - wallet_paid == 0) {
                                                        // since all amount is paid from wallet
                                                        cashfree_token = "";
                                                        cashfree_app = "";
                                                    }
                                                    
                                                    if ((req.body.wallet_status = "true")) {
                                                        if (order.amount - wallet_paid == "0") {
                                                            msg =
                                                            "Order placed successfully, thank you for shoping with us .";
                                                            // update order_status confirmed
                                                        }
                                                    }
                                                    
                                                    if (
                                                        wallet_record == "true" &&
                                                        wallet_paid != 0 &&
                                                        data_object.method != "cod" &&
                                                        finalamount <= user.wallet
                                                        ) {
                                                        var wallet_object = {
                                                            user_id: userid,
                                                            order_id: order.order_id,
                                                            amount: wallet_paid,
                                                            txn_type: "DEBIT",
                                                            remark:
                                                            "Amount debited against order #" + oid + ".",
                                                            date_time:
                                                            DateTime.date() + " " + DateTime.time(),
                                                            txn_status: "SUCCESS",
                                                        };
                                                        
                                                        const wallet = new Wallet(wallet_object);
                                                        wallet.save(wallet_object);
                                                        
                                                        // update user wallet
                                                        var new_wallet = user.wallet - wallet_paid;
                                                        
                                                        User.updateOne(
                                                            { _id: userid },
                                                            { wallet: new_wallet },
                                                            function (err, user) {
                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                            }
                                                        );
                                                    }
                                                    var result = {
                                                        _id: order._id,
                                                        user_id: user._id,
                                                        order_id: order.order_id,
                                                        shipping_charge: order.shipping_charge,
                                                        subtotal: order.subtotal,
                                                        // amount: (order.amount - (wallet_paid +  parseInt(req.body.coupon_discount))),
                                                        amount: (order.amount - wallet_paid),
                                                        method: order.method,
                                                        txn_status: order.txn_status,
                                                        order_status: order.order_status,
                                                        address: order.address,
                                                        remark: order.remark,
                                                        date_time: order.date_time,
                                                        app_id: cashfree_app,
                                                        cftoken: cashfree_token,
                                                        mode: mode,
                                                        paid_from_wallet: wallet_paid,
                                                        paid_online: online_paid,
                                                        current_wallet: user.wallet,
                                                    };
                                                    
                                                    console.log('#########');
                                                    console.log(result);
                                                    console.log(wallet_paid);
                                                    console.log(req.body.coupon_discount);
                                                    console.log('#########');
                                                    
                                                    if (result.order_status == "confirmed") {
                                                        //create record if coupon is onmousedown
                                                        if(req.body.coupon_code != "0")
                                                        {
                                                            var redeem_obj = {
                                                                coupon_code: req.body.coupon_code,
                                                                user_id: user._id,
                                                                discount: req.body.coupon_discount,
                                                                date: DateTime.date(),
                                                                time: DateTime.time()
                                                            };
                                                            
                                                            const redeem = new Redeem(redeem_obj);
                                                            
                                                            await redeem.save(redeem_obj);
                                                        }
                                                        
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
                                                    const cashfreetoken = await cashfree.generateToken(
                                                        oid,
                                                        result.amount
                                                    );
                                                    var cftoken = cashfreetoken.data.cftoken;
                                                    result.cftoken = cftoken;
                                                    
                                                    var final = {
                                                        res: "success",
                                                        msg: msg,
                                                        data: result,
                                                    };
                                                    res.status(200).send(final);
                                                    } else {
                                                    var final = {
                                                        res: "error",
                                                        msg: "Order not placed!",
                                                    };
                                                    res.status(400).send(final);
                                                }
                                            });
                                        }
                                        } else {
                                        var final = {
                                            res: "error",
                                            msg: "Address is invalid found!",
                                        };
                                        res.status(400).send(final);
                                    }
                                })
                                } else {
                                var final = {
                                    res: "error",
                                    msg: "Order can't be processes, cart is empty!",
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
        } catch (err) {
        var final = {
            res: "error",
            msg: "Something went wrong!",
        };
        res.status(400).send(final);
    }
});

module.exports = router;

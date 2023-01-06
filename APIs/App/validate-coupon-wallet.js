const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Coupons = require("./../../models/Web/coupon.schema");
const Redeem = require("./../../models/Web/redeem.schema");
const DateTime = require("./../../modules/date-time");
    
const upload = multer();

const CheckUsed = async (userid, coupon) => {
    // var current = DateTime.date();
    
    const count = await Redeem.find({ user_id: userid, coupon_code: coupon, coupon_type: "wallet" });

    var ret = 0;
    
    if(count){
        ret = count.length;
    }
     
    return ret;
}
 
router.post("/validate-coupon-wallet", upload.none(), function (req, res, next) {
    // all offer
    const coupon = new Coupons(req.body);
    const err = coupon.validateCouponCode(req.body);
     
    if (err.error) {
        var final =
        {
            res: "error",
            msg: err.error.details[0].message,
        };
        res.status(400).send(final);
    }
    else {  
        Coupons.findOne({ coupon_code: req.body.coupon_code, status:{$ne: false}, coupon_type: "wallet"})
        .exec({}, async function (err, doc) {
            if (err) {
                var final = {
                    res: "error",
                    msg: "Something went wrong!",
                    data: [],
                };
                res.status(400).send(final);
            }
            else {
                if (doc) {
                    if (doc.coupon_code == req.body.coupon_code) {
                    
                        req.body.order_amount = parseInt(req.body.order_amount);
                        var status = true;
                      
                        
						if(req.body.order_amount >= doc.order_above)
						{
							status = true;
						}
						else
						{ 
							status = false;
						}
                        
                                                    
                        if(status == true)
                        {
                            
                            if(doc.one_time === "yes")
                            {
                                //check if coupon used earlier
                                var check = await CheckUsed(req.body.user_id, req.body.coupon_code);
                                
                                if(check == 0)
                                {
                                    // check current date in format YYYY-MM-DD
                                    var d = new Date();
                                    const currentDate = [
                                        d.getFullYear(),
                                        ('0' + (d.getMonth() + 1)).slice(-2),
                                        ('0' + d.getDate()).slice(-2)
                                    ].join('-');
                                    
                                    const unixcurrent = Math.floor(new Date(currentDate + " 00:00:00.000").getTime() / 1000);
                                    const unixexp = Math.floor(new Date(doc.expiry + " 00:00:00.000").getTime() / 1000);
                                    if (unixexp > unixcurrent) {
                                        
                                        var coupondata = JSON.parse(JSON.stringify(doc));
                                        
                                        var type = coupondata.type;
                                        
                                        var amount = req.body.order_amount;
                                        amount = parseInt(amount);
                                       
                                        if(type==="percentage")
                                        {
                                            //percentage
                                            var percent = parseInt(coupondata.discount);
                                            
                                            var clearbalance = (amount * percent) / 100;
                                            
                                        }
                                        else
                                        {
                                            //flat
                                            var flat = parseInt(coupondata.discount);
                                            var clearbalance = flat;
                                        }
                                         
                                        coupondata.test = coupondata.discount;
                                        coupondata.discount = clearbalance; 
                                        
                                        var final ={
                                            res: "success",
                                            msg: "Coupon code applied successfully.",
                                            data: coupondata,
                                        };
                                        res.status(200).send(final);
                                    }
                                    else {
                                        var final =
                                        {
                                            res: "error",
                                            msg: "Coupon code is expired.",
                                            data: [],
                                        };
                                        res.status(400).send(final);
                                    }
                                }
                                else
                                {
                                    var final =
                                    {
                                        res: "error",
                                        msg: "This Coupon code can be only applied once.",
                                        data: [],
                                    };
                                    res.status(400).send(final);
                                }
                                
                            }
                            else
                            { 
                                // check current date in format YYYY-MM-DD
                                var d = new Date();
                                const currentDate = [
                                    d.getFullYear(),
                                    ('0' + (d.getMonth() + 1)).slice(-2),
                                    ('0' + d.getDate()).slice(-2)
                                ].join('-');
                                
                                const unixcurrent = Math.floor(new Date(currentDate + " 00:00:00.000").getTime() / 1000);
                                const unixexp = Math.floor(new Date(doc.expiry + " 00:00:00.000").getTime() / 1000);
                                if (unixexp > unixcurrent) {
                                    
                                    
                                    var coupondata = JSON.parse(JSON.stringify(doc));
                                        
                                    var type = coupondata.type;
                                    
                                    var amount = req.body.order_amount;
                                    amount = parseInt(amount);
                                   
                                    if(type==="percentage")
                                    {
                                        //percentage
                                        var percent = parseInt(coupondata.discount);
                                        
                                        var clearbalance = (amount * percent) / 100;
                                        
                                    }
                                    else
                                    {
                                        //flat
                                        var flat = parseInt(coupondata.discount);
                                        var clearbalance = flat;
                                    }
                                     
                                    coupondata.test = coupondata.discount;
                                    coupondata.discount = clearbalance; 
                                    
                                    var final ={
                                        res: "success",
                                        msg: "Coupon code applied successfully.",
                                        data: coupondata,
                                    };
                                    res.status(200).send(final);
                                }
                                else {
                                    var final =
                                    {
                                        res: "error",
                                        msg: "Coupon code is expired.",
                                        data: [],
                                    };
                                    res.status(400).send(final);
                                }
                            }
                            
                        }
                        else 
                        { 
                            var final = {
                                res: "error",
                                msg: "This offer only valid for, Order greater than or equal to "+doc.order_above+" .",
                                data: [],
                            };
                            res.status(400).send(final);
                        }
                        
                    } 
                    else {
                        var final =
                        {
                            res: "error",
                            msg: "Coupon code does not exist!",
                        };
                        res.status(400).send(final);
                    }
                }
                else {
                    var final =
                    {
                        res: "error",
                        msg: "Coupon code does not exist!",
                    };
                    res.status(400).send(final);
                }
            }
        });
    }
    
    
});

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const Coupon = require("./../../models/Web/coupon.schema");

const DateTime = require("./../../modules/date-time");
 
const upload = multer();

// Multer Configuration for single file upload

router.post("/create-coupon", upload.none(), function (req, res, next) {
    const coupon = new Coupon(req.body);
    if(req.body.order_above == "")
    {
        req.body.order_above = 0;
    }
    var err = coupon.joiValidate(req.body);
    if (err.error) {
        var final = {
            res: "error",
            msg: err.error.details[0].message,
        };
        res.status(400).send(final);
    } else {
        // check if coupon already exist with same code
        
        var status = true;
        if(req.body.type != "flat" && req.body.discount >=100)
        {
            status = false;
        }
    
        if(status == true)
        {
            req.body.coupon_code = req.body.coupon_code.toUpperCase();
            Coupon.findOne({ coupon_code: req.body.coupon_code, coupon_type: req.body.coupon_type })
            .exec({}, function (err, doc) {
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
                        var final = {
                            res: "error",
                            msg: "Coupon already exist!",
                            data: [],
                        }; 
                        res.status(400).send(final);
                    } 
                    else {
                        // save coupon
                        coupon.save(function (err, doc) {
                            if (err) {
                                var final = {
                                    res: "error",
                                    msg: "Something went wrong!",
                                    data: [],
                                };
                                res.status(400).send(final);
                            } else {
                                var final = {
                                    res: "success",
                                    msg: "Coupon created successfully!",
                                    data: doc,
                                }; 
                                res.status(200).send(final);
                            }
                        })
                    }
                }
            })
        }
        else
        { 
            var final = {
                res: "error",
                msg: "Percentage must be smaller than 100!",
            }; 
            res.status(200).send(final);
        }
        
		
    }
});

module.exports = router;

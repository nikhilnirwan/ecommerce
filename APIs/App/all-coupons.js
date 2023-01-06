const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Coupons = require("./../../models/Web/coupon.schema");

const upload = multer();

router.get("/all-coupons", upload.none(), function (req, res, next) {
    // all offer 
    try {  
        Coupons.find({status:{$ne: false}, coupon_type: "order"})
            // populate product and category, brand inside product
            .sort({ _id: -1 })
            .exec({}, function (err, docs) {
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
                        msg: docs.length + " coupons(s) found.",
                        data: docs,
                    };
                    res.status(200).send(final);
                }
            });
    } catch (e) {
        var final = {
            res: "error",
            msg: "Something went wrong!",
            data: [],
        };
        res.status(400).send(final);
    }
});

module.exports = router;

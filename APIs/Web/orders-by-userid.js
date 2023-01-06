const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Order = require("./../../models/Web/order.schema");
const User = require("./../../models/Web/user.schema");

router.post("/order-by-userid", upload.none(), function (req, res, next) { 

    if (req.body) {
        var userid = req.body.userid;

        //check if user exist
        User.findOne({ _id: userid }, function (err, user) {
            if (user) {
                Order.find({ user_id: userid })
                    .sort({ _id: -1 })
                    .populate("user_id")
                    .exec({}, function (err, result) {
                        if (result) {
                            var final = {
                                res: "success",
                                msg: result.length + " Order found!",
                                data: result,
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
            }
            else {
                var final = {
                    status: "error",
                    message: "User not found"
                };
                res.status(400).send(final);
            }
        })
    }
    else {
        var final = {
            res: "error",
            msg: "POST Body can't be left empty!",
        };
        res.status(400).send(final);
    }


});

module.exports = router;

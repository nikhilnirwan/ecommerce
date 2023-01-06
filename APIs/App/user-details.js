const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");
const upload = multer();

router.post("/user-details", upload.none(), function (req, res, next) {
    
    
    if(req.body)
    {
        
        var data_obj = {
            user_id: req.body.user_id,
        };
        
        const user = new User(data_obj);
        var err = user.joiValidateUserId(req.body);
        
        if (err.error) {
            var final = {
                res: "error",
                msg: err.error.details[0].message,
            };
            res.status(400).send(final);
            } else {
            // find user by user_id
            User.find({ _id: req.body.user_id }, function (err, doc) {
                if (doc) {
                    var final = {
                        res: "success",
                        msg: "User found.",
                        data: doc,
                    };
                    res.status(200).send(final);
                    } else {
                    var final = {
                        res: "error",
                        msg: "User ID is invalid!",
                        data: [],
                    };
                    res.status(400).send(final);
                }
            });
        }
    }
    else
    {
        var final = {
            res: "error",
            msg: "Please send userid.",
        };
        res.status(400).send(final);
    }
    
});

module.exports = router;

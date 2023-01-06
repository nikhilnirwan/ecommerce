const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
var User = require("./../../models/Web/user.schema");
const upload = multer();

const DateTime = require("./../../modules/date-time");

router.post("/update-profile", upload.none(), function (req, res, next) {
    const user = new User(req.body);
    var err = user.validateProfileUpdate(req.body);
    console.log(req.body);
    if (err.error) {
        var final = {
            res: "error",
            msg: err.error.details[0].message,
        };
        res.status(400).send(final);
        } else {
        // verify user
        User.findOne({ user_id: req.body.user_id }, function (err, user) {
            if (user) {
                
                if(user.email == req.body.email)
                {
                    var update_obj = {
                        name: req.body.name,
                    };
                }
                else
                { 
                    var update_obj = {
                        name: req.body.name,
                        email: req.body.email,
                    };
                }
                User.findOneAndUpdate(
                    { user_id: req.body.user_id },
                    {
                        $set: update_obj,
                    },
                    { new: true },
                    function (err, user) {
                        if (err) {
                            var final = {
                                res: "error",
                            msg: "Something went wrong!",
                            };
                            res.status(400).send(final);
                            } else {
                            var final = {
                                res: "success",
                                msg: "Profile updated successfully!",
                                data: user,
                            };
                            res.status(200).send(final);
                        }
                    }
                );
                } else {
                var final = {
                    res: "error",
                    msg: "User not found",
                };
                res.status(400).send(final);
            }
        });
    }
});

module.exports = router;

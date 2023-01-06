const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const User = require("./../../models/Web/user.schema");
const Token = require("./../../models/Web/firebase.schema");
const firebase = require("./../../modules/firebase");

const GetToken = async(user_id) => {
    const list = await Token.find({user_id: user_id});
    
    if(list.length>0)
    {
        return list[0].token;
    }
    else
    {
        var token = "";
        return token;
    }
}
 
router.post("/reject-account", upload.none(), function (req, res, next) {
    const user = new User(req.body);
    const err = user.joiValidateRemark(req.body);
     
    if (err.error) {
        var final = {
            res: "error",
            msg: err.error.details[0].message,
        };
        res.status(400).send(final);
        } else {
        // find user by id
        User.findOne({ _id: req.body.user_id }, function (err, user) {
            if (user) {
                // update user status to true
                User.findOneAndUpdate(
                    { _id: req.body.user_id }, 
                    { $set: { appr_status: "true", reject_status: "true",reject_remark: req.body.remark } },
                    { new: "true" },
                    async function (err, data) { 
                        if (data) {  
                            var content = {
                                title: "Hi "+user.name+", Your verification is rejected.",
                                body: req.body.remark
                            }; 
                            const key = await GetToken(user._id);
                            
                            if(key != "")
                            {   
                              var firebaseres =  await firebase.sendNotification(key, content);
                            }  
                            var final = {
                                res: "success",
                                msg: "Account rejected successfully",
                                data: data,
                            };
                            res.status(200).send(final);
                            } else {
                            var final = { 
                                res: "error",
                                msg: "Something went wrong",
                            };
                            res.status(400).send(final); 
                        }
                    }
                );
                } else {
                var final = {
                    res: "error",
                    msg: "User ID is invalid",
                };
                res.status(400).send(final);
            }
        });
    }
});

module.exports = router;

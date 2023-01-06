const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const Category = require("./../../models/Web/category.schema");
const upload = multer();
const Product = require("./../../models/Web/product.schema");

router.post("/toggle-category", upload.none(), function (req, res, next) {
    const category = new Category(req.body);
    const err = category.joiValidateEdit(req.body);
    
    if (err.error) {
        var final = {
            res: "error",
            msg: err.error.details[0].message,
            data: [],
        };
        res.status(400).send(final);
        } else {
        //find brand by id
        Category.findById(req.body.id, function (err, result) {
            if (result) {
                // toggle brand status
                var status = "true";
                if (result.status == true) {
                    status = false;
                    } else {
                    status = true;
                }
                
                // update brand status
                Category.findByIdAndUpdate(
                    req.body.id,
                    { status: status },
                    { new: true },
                    function (err, result) {
                        if (result) {
                            
                              Product.updateMany({ category: req.body.id}, {status: status}, function(err, results){
                                  if(results)
                                  {
                                    var msg = "";
                                    if (status == true) {
                                        msg = "Category activated successfully.";
                                        } else {
                                        msg = "Category deactivated successfully.";
                                    }
                                    var final = {
                                        res: "success",
                                        msg: msg,
                                        data: result,
                                    };
                                    res.status(200).send(final);
                                  }
                                  else
                                  {
                                      var final = {
                                        res: "error",
                                        msg: "Something went wrong!",
                                    };
                                    res.status(400).send(final);
                                  }
                              })
                            } else {
                            var final = {
                                res: "error",
                                msg: "Something went wrong!",
                            };
                            res.status(400).send(final);
                        }
                    }
                );
                } else {
                var final = {
                    res: "error",
                    msg: "Invalid category ID!",
                    data: [],
                };
                res.status(400).send(final);
            }
        });
    }
});

module.exports = router;

const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Cart = require("./../../models/Web/cart.schema");
const Product = require("./../../models/Web/product.schema");
const User = require("./../../models/Web/user.schema");
const upload = multer();

router.post("/add-to-cart", upload.none(), function (req, res, next) {
    
    User.findById(req.body.user_id, function (err, user) {
        if(user)
        {
            if(user.reject_status == "false")
            {
                // check if proudtc id is valid
                var product_id = req.body.product_id;
                
                // validate id
                Product.findById(product_id, function (err, product) {
                    if (!product) {
                        var final = {
                            res: "error",
                            msg: "Product ID is not valid!",
                        };
                        res.status(400).send(final);
                        } else {
                        var data_obj = {
                            user_id: req.body.user_id,
                            product_id: req.body.product_id,
                            quantity: req.body.quantity,
                            product_data: JSON.stringify(product),
                        };
                        const cart = new Cart(data_obj);
                        var err = cart.joiValidate(req.body);
                        
                        if (err.error) {
                            var final = {
                                res: "error",
                                msg: err.error.details[0].message,
                            };
                            res.status(400).send(final);
                            } else {
                            //check if already in cart
                            Cart.findOne(
                                {
                                    user_id: req.body.user_id,
                                    product_id: req.body.product_id,
                                    order_id: "0",
                                    status: false,
                                },
                                function (err, doc) {
                                    if (!doc) {
                                        if (req.body.quantity == 0) {
                                            var final = {
                                                res: "error",
                                                msg: "Quantity must be greater than 0 for adding!",
                                                data: [],
                                            };
                                            res.status(200).send(final);
                                            } else {
                                            cart.save(function (err, result) {
                                                if (err) {
                                                    var final = {
                                                        res: "error",
                                                        msg: "Something went wrong!",
                                                    };
                                                    res.status(400).send(final);
                                                    } else {
                                                    var final = {
                                                        res: "success",
                                                        msg: "Cart item added successfully",
                                                        data: result,
                                                    };
                                                    res.status(200).send(final);
                                                }
                                            });
                                        }
                                        } else {
                                        if (req.body.quantity == 0) {
                                            Cart.findByIdAndDelete(doc._id, function (err, result) {
                                                if (err) {
                                                    var final = {
                                                        res: "error",
                                                        msg: "Something went wrong!",
                                                    };
                                                    res.status(400).send(final);
                                                    } else {
                                                    var final = {
                                                        res: "success",
                                                        msg: "Cart item removed successfully",
                                                    };
                                                    res.status(200).send(final);
                                                }
                                            });
                                            } else {
                                            //if already in cart just update
                                            Cart.findOneAndUpdate(
                                                {
                                                    user_id: req.body.user_id,
                                                    product_id: req.body.product_id,
                                                    order_id: "0",
                                                    status: false,
                                                },
                                                {
                                                    quantity: req.body.quantity,
                                                },
                                                {
                                                    new: true,
                                                },
                                                function (err, doc) {
                                                    if (err) {
                                                        var final = {
                                                            res: "error",
                                                            msg: "Something went wrong!",
                                                        };
                                                        res.status(400).send(final);
                                                        } else {
                                                        var final = {
                                                            res: "success",
                                                            msg: "Cart item updated successfully",
                                                            data: doc,
                                                        };
                                                        res.status(200).send(final);
                                                    }
                                                }
                                            );
                                        }
                                    }
                                }
                            );
                        }
                    }
                }); 
            }
            else
            {
                var final = { 
                    res: "error",
                    msg: "Your Account is rejeted please update your documents first before adding to cart!",
                };
                res.status(400).send(final);
            }
            
        }
        else
        {
            var final = {
                res: "error",
                msg: "User ID is not valid!",
            };
            res.status(400).send(final);
        }
    })
});

module.exports = router;

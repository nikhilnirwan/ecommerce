const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Offer = require("./../../models/Web/offer.schema");
const Product = require("./../../models/Web/product.schema");
const { parse } = require("dotenv");
const upload = multer();

function containsObject(product_id, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].product === product_id) {
            return true;
        }
    }

    return false;
}

router.post(
    "/offer-entry",
    upload.none(),
    function (req, res, next) {
        const offer = new Offer(req.body);
        var err = offer.joiValidate(req.body);

        if (err.error) {
            var final = {
                res: "error",
                msg: err.error.details[0].message,
            };
            res.status(400).send(final);
        } else {
            var productids = JSON.parse(req.body.product);

            // truncate offer collection
            Offer.deleteMany({}, async function (err, result) {

                if (result) {
                    var bulk = [];
                    // for (var i = 0; i < productids.length; i++) {
                    for (element of productids) {

                        await Product.findOne({
                            _id: element
                        })
                            .exec()
                            .then((data) => {
                                if (data) {
                                    var check = containsObject(element, bulk);
                                    if (!check) {
                                        bulk.push({ product: element });
                                    }
                                }
                            })
                    }
                    if (bulk.length) {
                        // bulk insert in offer
                        Offer.collection.insertMany(bulk, function (err, result) {
                            if (err) {
                                var final = {
                                    res: "error",
                                    msg: "Something went wrong!",
                                };
                                res.status(400).send(final);
                            } else {
                                var final = {
                                    res: "success",
                                    msg: "Offer saved successfully!",
                                };
                                res.status(200).send(final);
                            }
                        })
                    }
                    else {
                        var final = {
                            res: "success",
                            msg: "Offers deleted successfully!",
                        };
                        res.status(400).send(final);
                    }

                }
                else {
                    var final = {
                        res: "error",
                        msg: "Something went wrong!",
                    };
                    res.status(400).send(final);
                }
            });
        }
    }
);

module.exports = router;

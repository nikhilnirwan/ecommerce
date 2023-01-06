const express = require("express");
const router = express.Router();
const multer = require("multer");

// const mongoose = require("mongoose");
const Product = require("./../../models/Web/product.schema");
const Batch  = require("./../../models/Web/batch.schema");

const upload = multer();

const findBatch = async (product_id) => {
    return Batch.find({product_id: product_id}).sort({_id:-1});
}

router.post("/product-details/:any", upload.none(), function (req, res, next) {
    if (req.params.any) {
        const id = req.params.any;
        // find by id
        Product.findById(id)
        .populate("category") 
        .populate("brand")
        .exec({}, async function (err, result) {
            if (result) {
                result.image1 =
                process.env.BASEURL + "public/uploads/product/" + result.image1;
            
                var batch_list = await findBatch(result._id);
                var final = {
                    res: "success",
                    msg: "Product found!",
                    data: result,
                    batch: batch_list
                };
                res.status(200).send(final);
                } else {
                var final = {
                    res: "error",
                    msg: "Product not found!",
                };
                res.status(400).send(final);
            }
        });
        
        // try {
        //   Product.findById(id)
        //     .populate("category")
        //     .populate("brand")
        //     .exec({}, function (err, docs) {
        //       if (err) {
        //         if (err.name == "CastError") {
        //           var final = {
        //             res: "error",
        //             msg: "Product ID format is invalid!",
        //             data: [],
        //           };
        //         } else {
        //           var final = {
        //             res: "error",
        //             msg: "Somethding went wrong!",
        //             data: [],
        //           };
        //         }
        //         res.status(400).send(final);
        //       } else {
        //         // provide image path
        //         docs.image1 =
        //           process.env.BASEURL + "public/uploads/product/" + docs.image1;
        //         var final = {
        //           res: "success",
        //           msg: "Product found successfully!",
        //           data: docs,
        //         };
        //         res.status(200).send(final);
        //       }
        //     });
        // } catch (e) {
        //   var final = {
        //     res: "error",
        //     msg: "Something went wrong!",
        //     data: [],
        //   };
        //   res.status(400).send(final);
        // }
        } else {
        var final = {
            res: "error",
            msg: "Product ID should not be empty!",
            data: [],
        };
        res.status(400).send(final);
    }
});

module.exports = router;

const e = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Coupon = require("./../../models/Web/coupon.schema");

const DateTime = require("./../../modules/date-time");

const upload = multer();

// Multer Configuration for single file upload

router.post("/update-coupon", upload.none(), function (req, res, next) {
    const coupon = new Coupon(req.body);
    var err = coupon.joiValidateUpdate(req.body);
    if (err.error) {
        var final = {
            res: "error",
            msg: err.error.details[0].message,
		};
        res.status(400).send(final);
		} else {
		
        Coupon.findOne({ _id: req.body.id })
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
					// check if coupon already exist with same code
					Coupon.findOne({ coupon_code: req.body.coupon_code })
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
								if (doc.coupon_code == req.body.coupon_code) {
									// update coupon
									Coupon.findByIdAndUpdate(req.body.id, req.body, { new: true }, function (err, doc) {
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
												msg: "Coupon updated successfully!",
												data: doc,
											};
											res.status(200).send(final);
										}
									})
								}
								else {
									var final = {
										res: "error",
										msg: "Coupon with same code already exist!",
										data: [],
									};
									res.status(400).send(final);
								}
							}
							else {
								// update coupon
								Coupon.updateOne({ _id: req.body.id }, req.body, function (err, doc) {
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
											msg: "Coupon updated successfully!",
											data: doc,
										};
										res.status(200).send(final);
									}
								})
							}
						}
					})
                    } else {
					var final = {
						res: "error",
						msg: "Coupon not found!",
						data: [],
					};
					res.status(400).send(final);
				}
			}
		})
	}
});

module.exports = router;

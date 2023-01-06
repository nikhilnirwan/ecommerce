const { json } = require("express");
const e = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");
const DateTime = require("./../../modules/date-time");

router.post("/return-order", upload.none(), function (req, res, next) {
	const order = new Order(req.body);
	var err = order.returnOrder(req.body);
	if (err.error) {
		var final = {
			res: "error",
			msg: err.error.details[0].message,
		};
		res.status(400).send(final);
		} else {
		// verify order id 
		Order.findOne({ order_id: req.body.order_id }, function (err, order) {
			if (order) {
				if (order.order_status === "delivered") {
					Order.findOneAndUpdate( 
						{ order_id: req.body.order_id },
						{
							order_status: "returned",
							remark: "Return request initiated successfully.",
							return_status: false,
							return_remark: req.body.return_feedback
						},
						{ new: true },
						function (err, latest) {
							if(latest){
								var final = {
									res: "success",
									msg: "Order return request initiated successfully",
									data: latest,
								};
								res.status(200).send(final);
							}else{
								var final = {
									res: "error",
									msg: "Something went wrong!",
									data: latest,
								};
								res.status(200).send(final);
							}
						}
					);
					} else {
					var final = {
						res: "error",
						msg: "Order is not yet delivered!",
					};
					res.status(400).send(final);
				}
				} else {
				var final = {
					res: "error",
					msg: "Order ID is invalid!",
				};
				res.status(400).send(final);
			}
		});
	}
});

module.exports = router;

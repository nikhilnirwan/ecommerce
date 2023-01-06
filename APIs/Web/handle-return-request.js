const { json } = require("express");
const e = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const upload = multer();
const Tracking = require("./../../models/Web/order-tracking.schema");
const DateTime = require("./../../modules/date-time");

router.post("/handle-return-request", upload.none(), function (req, res, next) {
	const order = new Order(req.body);
	var err = order.returnOrderHandle(req.body);
	if (err.error) {
		var final = {
			res: "error",
			msg: err.error.details[0].message,
		};
		res.status(400).send(final);
		} else {
		// verify order id 
		Order.findOne({ _id: req.body.order_id }, function (err, order) {
			if (order) {
				if (order.order_status === "returned") {
					
					if(req.body.status != "approved")
					{
						//complete return process
						Order.findOneAndUpdate( 
							{ _id: req.body.order_id },
							{ 
								order_status: "delivered",
								remark: "Order delivered successfully.",
								return_status: false,
								return_remark: "Return request rejected."
							},
							{ new: true },
							function (err, latest) {
								if(latest){
									var final = {
										res: "success",
										msg: "Order return request rejected successfully",
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
					}
					else
					{
						//rejet reject return
						Order.findOneAndUpdate( 
							{ _id: req.body.order_id },
							{
								order_status: "returned",
								remark: "Order return completed.",
								return_status: true,
								return_remark: "Return request approved."
							},
							{ new: true },
							function (err, latest) {
								if(latest){
									var final = {
										res: "success",
										msg: "Order return request approved successfully",
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
					}
					} else {
					var final = {
						res: "error",
						msg: "No return request raised for this order!",
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

const e = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("./../../models/Web/product.schema");
const Batch = require("./../../models/Web/batch.schema");
const DateTime = require("./../../modules/date-time");

const upload = multer();

const saveBatch = async (json) => {
	const batch = new Batch(json);
	
	var res = await batch.save();
	
	return res;
}

// Multer Configuration for single file upload

router.post("/update-stock", upload.none(), function (req, res, next) {
    if(req.body)
	{
		const product = new Product(req.body);
		var err = product.joiValidateUpdateStock(req.body);
		if (err.error) {
			var final = {
				res: "error",
				msg: err.error.details[0].message,
			};
			res.status(400).send(final);
			} else {
			
			Product.findOne({ _id: req.body.id })
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
					if(doc){
						var newstock = parseInt(req.body.stock) + parseInt(doc.stock);
						Product.findByIdAndUpdate(req.body.id, {stock: newstock}, { new: true }, async function (err, result) {
							if(result){
								//save batch
								await saveBatch({product_id: req.body.id, batch_id: req.body.batch_id, date_time: 'c', stock: req.body.stock});
								
								var final = {
									res: "success",
									msg: "Stock updated successfully!",
									data: [],
								};
								res.status(200).send(final);
							}
							else
							{
								var final = {
									res: "error",
									msg: "Something went wrong!",
									data: [],
								};
								res.status(400).send(final);
							}
						})
						}else{
						var final = {
							res: "error",
							msg: "No data found!",
							data: [],
						};
						res.status(400).send(final);
					}
				}
			})
		}
	}
	else
	{
		var final = {
			res: "error",
			msg: "Body should'nt be empty!",
			data: [],
		};
		res.status(400).send(final);
	}
	
});

module.exports = router;

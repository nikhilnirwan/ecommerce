const express = require("express");
const router = express.Router();
const multer = require("multer");
const Category = require("./../../models/Web/category.schema");

const DateTime = require("./../../modules/date-time");

// Multer Configuration for single file upload

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads/category/");
	},
	filename: function (req, file, cb) {
		const filename = Date.now() + "-" + file.originalname;
		cb(null, filename);
	},
});

// check if file is not empty then upload

var upload = multer({
	storage: storage,
});

router.post(
	"/update-category",
	upload.single("image"),
	function (req, res, next) {
		try {
			// find by id
			
			Category.findById(req.body.id, function (err, doc) {
				if (doc) {
					var id = req.body.id;
					if (req.file) {
						var data_obj = {
							name: req.body.name,
							icon: req.file.filename,
						};
						} else {
						var data_obj = {
							name: req.body.name,
						};
					}
					
					const category = new Category(data_obj);
					var err = category.joiValidate({ name: req.body.name });
					
					if (err.error) {
						var final = {
							res: "error",
							msg: err.error.details[0].message,
						};
						
						res.status(400).send(final);
						} else {
						//find by id and update
						Category.findByIdAndUpdate(
							id,
							data_obj,
							{ new: true },
							function (err, doc) {
								if (err) {
									res.send(err);
									var final = {
										res: "error",
										msg: "Something went wrong!",
										data: [],
									};
									res.status(400).send(final);
									} else {
									var final = {
										res: "success",
										msg: "Category updated successfully!",
										data: doc,
									};
									res.status(200).send(final);
								}
							}
						);
					}
					} else {
					var final = {
						res: "error",
						msg: "Category not found",
					};
					res.status(400).send(final);
				}
			});
			} catch (e) {
			var final = {
				res: "error",
				msg: "Something went wrong!",
				data: [],
			};
			res.status(400).send(final);
		}
	}
);

module.exports = router;

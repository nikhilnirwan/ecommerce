const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer"); 
const Contact = require("./../../models/Web/contact.schema");
const upload = multer();

router.get("/all-contact", upload.none(), function (req, res, next) {
	// all category
	try {
		Contact.find()
		.sort({ _id: -1 })
		.exec({}, async function (err, docs) {
			var final = {
				res: "success",
				msg: docs.length + " contact(s) found.",
				data: docs,
			};
			res.status(200).send(final);
		});
		} catch (e) {
		var final = {
			res: "error",
			msg: "Something went wrong!",
			data: [],
		};
		res.status(400).send(final);
	}
});

module.exports = router;

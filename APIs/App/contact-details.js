const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.get("/contact-details", upload.none(), function (req, res, next) {
	
	var details = [{
		mobile: {
			primary: "9125356677",
			secondary: ""
		},
		email: "edawai.sw@gmail.com",
		address: {
			line1: "SwipeWire Commerce Private Limited",
			line2: "DK Bio Park",
			line3: "497/5 and 6, Babuganj",
			city: "Lucknow",
			pincode: "226020",
		}	
	}];
	
	var final = {
		res: "success",
		msg: "Contact details found!",
		data: details
	};
	res.status(200).send(final);
});

module.exports = router;

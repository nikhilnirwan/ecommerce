const express = require("express");
const router = express.Router();
const multer = require("multer");
const ContactUs = require("./../../models/Web/contact.schema");

const DateTime = require("./../../modules/date-time");

const upload = multer();

// Multer Configuration for single file upload

router.post("/contact-us", upload.none(), function (req, res, next) {
    req.body.date_time = DateTime.date() + " " + DateTime.time();
	const contact = new ContactUs(req.body);
	
	if(req.body)
	{ 
		//form validation
		var err = contact.joiValidate(req.body);
		if (err.error) { 
			var final = {
				res: "error",
				msg: err.error.details[0].message,
			};
			res.status(400).send(final);
		}else{ 
			
			contact.save(function(err, doc){
				if(err){
					 var final = {
						res: "error",
						msg: "Something went wrong!",
						data: [],
					};
					res.status(400).send(final);
				}
				else{
					var final = {
						res: "success",
						msg: "We have received your request, we'll get back to you soon!",
						data: [doc],
					};
					res.status(200).send(final);
				}
			})	
		}
	}
	else
	{
		var final = {
            res: "error",
		msg: "Something went wrong!",
        };
		console.log(final);
        res.status(400).send(final);
	}
	
});

module.exports = router;

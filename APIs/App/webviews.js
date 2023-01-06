const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.get("/webview", upload.none(), function (req, res, next) {
	var arr = [
		{name: "Privacy Policy", link: "https://edawai.vercel.app/PrivacyPolicy"},
		{name: "Terms & Condition", link: "https://edawai.vercel.app/TermsCondition"},
		{name: "Help & Support", link: "https://edawai.vercel.app/HelpSupport"},
	];
	 
	res.status(200).send(arr);
});

module.exports = router;

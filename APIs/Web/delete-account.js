const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const User = require("./../../models/Web/user.schema");

router.post("/delete-account", upload.none(), function (req, res, next) {
  const user = new User(req.body);
  const err = user.joiValidateUserId(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    // find user by id
    User.findOne({ _id: req.body.user_id }, function (err, user) {
      if (user) {
		//delete user 
		User.findByIdAndRemove(req.body.user_id, function(err){
			if(!err)
			{
				var final = {
				  res: "success",
				  msg: "Account deleted successfully!",
				};
				res.status(200).send(final);
			}
			else
			{
				var final = {
				  res: "error",
				  msg: "Something went wrong!",
				};
				res.status(400).send(final);
			}
		});
      } else {
        var final = {
          res: "error",
          msg: "User ID is invalid",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

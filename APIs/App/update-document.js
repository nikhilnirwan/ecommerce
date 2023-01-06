const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../../models/Web/user.schema");

const DateTime = require("./../../modules/date-time");

// Multer Configuration for single file upload

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/docs/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

 
var upload = multer({
  storage: storage,
}); 

router.post("/update-document", upload.single("image"), function (req, res, next) {
  try {
    if (req.body.id) {
      // find brand by id
      User.findById(req.body.id, function (err, user) {
        if (user) {
          
			var data_obj = {
			  [req.body.name]: req.file.filename,
			  appr_status: "false",
			  reject_status: "false",
			  reject_remark: "",
			};
            
          const user = new User(data_obj);
          var err = user.joiDocumentUpload(req.body);
	
          if (err.error) {
            var final = {
              res: "error",
              msg: err.error.details[0].message,
            };

            res.status(400).send(final);
          } else {
            //update brand
            User.findByIdAndUpdate(
              req.body.id,
              data_obj,
              { new: true },
              function (err, doc) {
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
                    msg: "User updated successfully!",
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
            msg: "User not found!",
            data: [],
          };
          res.status(400).send(final);
        }
      });
    } else {
      var final = {
        res: "error",
        msg: "User ID is required!",
        data: [],
      };
      res.status(400).send(final);
    }
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

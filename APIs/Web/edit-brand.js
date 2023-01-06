const express = require("express");
const router = express.Router();
const multer = require("multer");
const Brand = require("./../../models/Web/brand.schema");

const DateTime = require("./../../modules/date-time");

// Multer Configuration for single file upload

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/brand/");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

//allowed file types for multer
var fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
 
var upload = multer({
  storage: storage,
}); 

router.post("/update-brand", upload.single("image"), function (req, res, next) {
  try {
    if (req.body.id) {
      // find brand by id
      Brand.findById(req.body.id, function (err, brand) {
        if (brand) {
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

          const brand = new Brand(data_obj);
          var err = brand.joiValidateEdit(req.body);

          if (err.error) {
            var final = {
              res: "error",
              msg: err.error.details[0].message,
            };

            res.status(400).send(final);
          } else {
            //update brand
            Brand.findByIdAndUpdate(
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
                    msg: "Brand updated successfully!",
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
            msg: "Brand not found!",
            data: [],
          };
          res.status(400).send(final);
        }
      });
    } else {
      var final = {
        res: "error",
        msg: "Brand ID is required!",
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

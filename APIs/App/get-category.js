const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const multer = require("multer");
const Category = require("./../../models/Web/category.schema");
const upload = multer();

router.get("/get-category", upload.none(), function (req, res, next) {
  // all category
  try { 
  
    /*
    https://stackoverflow.com/questions/32466365/mongoose-find-with-default-value
    When you execute a find query, it is passed to Mongo when no document is constructed yet. Mongo is not aware about defaults, so since there are no documents where isClever is explicitly true, that results in empty output.
    */ 
     
    Category.find({status: {$ne: false}}) 
      .sort({ _id: -1 })
      .exec({}, function (err, docs) {
        if (err) {
          var final = {
            res: "error",
            msg: "Something went wrong!",
            data: [],
          }; 
          res.status(400).send(final);
        } else {
          docs.forEach((element) => {
            element.icon =
              process.env.BASEURL + "public/uploads/category/" + element.icon;
          });
          
          

          var final = {
            res: "success",
            msg: docs.length + " category(s) found.",
            data: docs,
          };
          res.status(200).send(final);
          // console.log(req);
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
});

module.exports = router;

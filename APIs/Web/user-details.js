const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Order = require("./../../models/Web/order.schema");
const User = require("./../../models/Web/user.schema");

const GetOrderByUserId = async (userid) => {
  const order = await Order.findOne({ user_id: userid }).sort({ _id: -1 });
  var last_order = "";
  if (order) {
    last_order = order.date_time;
  }
  return last_order;
}

const GetOrderCount = async (userid) => {
  const order = await Order.find({ user_id: userid }).sort({ _id: -1 });
  var total_order = 0;
  if (order) {
    total_order = order.length;
  }
  return total_order;
}

router.post("/user-details", upload.none(), function (req, res, next) {
  const user = new User(req.body);
  const err = user.joiValidateUserId(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    //find user by id
    User.findById(req.body.user_id).exec(async function (err, doc) {
      if (doc) {

        // find order by user id
        const total_order = await GetOrderCount(req.body.user_id);
        const last_order = await GetOrderByUserId(req.body.user_id);

        const result = {
          total_order: total_order,
          last_order: last_order,
          last_active: doc.last_active,
          name: doc.name,
          desigination: doc.desigination,
          mobile: doc.mobile,
          email: doc.email,
          bussiness_name: doc.bussiness_name,
          shop_address: doc.shop_address,
          pincode: doc.pincode,
          state: doc.state,
          district: doc.district,
          ref_by_code: doc.ref_by_code,
          added_on: doc.added_on,
          otp: doc.otp,
          appr_status: doc.appr_status,
          gst_no: doc.gst_no,
          wallet: doc.wallet,
          date_time: doc.date_time,
          reject_status: doc.reject_status,
          reject_remark: doc.reject_remark,
        };
 
        // druglic: doc.druglic,
        if (doc.druglic) {
          result.druglic =
            process.env.BASEURL + "public/uploads/docs/" + doc.druglic;
        }
        // gst: doc.gst,
        if (doc.gst) {
          result.gst = process.env.BASEURL + "public/uploads/docs/" + doc.gst;
        }

        // cert_form20: doc.cert_form20,
        if (doc.cert_form20) {
          result.cert_form20 =
            process.env.BASEURL + "public/uploads/docs/" + doc.cert_form20;
        } else {
          result.cert_form20 = "";
        }
        // cert_form21: doc.cert_form21,
        if (doc.cert_form21) {
          result.cert_form21 =
            process.env.BASEURL + "public/uploads/docs/" + doc.cert_form21;
        } else {
          result.cert_form21 = "";
        }
        // cert_form20b: doc.cert_form20b,
        if (doc.cert_form20b) {
          result.cert_form20b =
            process.env.BASEURL + "public/uploads/docs/" + doc.cert_form20b;
        } else {
          result.cert_form20b = "";
        }
        // cert_form21b: doc.cert_form21b,
        if (doc.cert_form21b) {
          result.cert_form21b =
            process.env.BASEURL + "public/uploads/docs/" + doc.cert_form21b;
        } else {
          result.cert_form21b = "";
        }
        // cert_form20d: doc.cert_form20d,
        if (doc.cert_form20d) {
          result.cert_form20d =
            process.env.BASEURL + "public/uploads/docs/" + doc.cert_form20d;
        } else {
          result.cert_form20d = "";
        }
        // cert_form20c: doc.cert_form20c,
        if (doc.cert_form20c) {
          result.cert_form20c =
            process.env.BASEURL + "public/uploads/docs/" + doc.cert_form20c;
        } else {
          result.cert_form20c = "";
        }
        // cert_fssai_central: doc.cert_fssai_central,
        if (doc.cert_fssai_central) {
          result.cert_fssai_central =
            process.env.BASEURL +
            "public/uploads/docs/" +
            doc.cert_fssai_central;
        } else {
          result.cert_fssai_central = "";
        }
        // cert_fssai_state: doc.cert_fssai_state,
        if (doc.cert_fssai_state) {
          result.cert_fssai_state =
            process.env.BASEURL + "public/uploads/docs/" + doc.cert_fssai_state;
        } else {
          result.cert_fssai_state = "";
        }

        var final = {
          res: "success",
          msg: "User details found.",
          data: result,
        };
        res.status(200).send(final);
      } else {
        var final = {
          res: "error",
          msg: "User ID is invalid!",
        };
        res.status(400).send(final);
      }
    });
  }
});

module.exports = router;

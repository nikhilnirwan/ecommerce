const express = require("express");
const router = express.Router();
const multer = require("multer");
const State = require("./../../models/Web/state.schema");
const upload = multer();

const User = require("./../../models/Web/user.schema");
const MedicineRequest = require("./../../models/Web/request-medicine.schema");
const ToadyOffer = require("./../../models/Web/offer.schema");
const Coupon = require("./../../models/Web/coupon.schema");
const Product = require("./../../models/Web/product.schema");
const Brand = require("./../../models/Web/brand.schema");
const Category = require("./../../models/Web/category.schema");
const Slider = require("./../../models/Web/slider.schema");
const Notifications = require("./../../models/Web/notification.schema");
const Order = require("./../../models/Web/order.schema");

router.get("/dashboard-stats", upload.none(), async function (req, res, next) {

    //Users
    let all_user = await User.find({});
    all_user = all_user.length;

    let active_user = await User.find({ appr_status: 'true' });
    active_user = active_user.length;

    let pending_user = await User.find({ appr_status: 'false' });
    pending_user = pending_user.length;

    //Request
    let medicine_request = await MedicineRequest.find({});
    medicine_request = medicine_request.length;

    //offers
    let today_offer = await ToadyOffer.find({});
    today_offer = today_offer.length;

    //discount coupon
    let discount_coupon = await Coupon.find({});
    discount_coupon = discount_coupon.length;

    //Products
    let all_products = await Product.find({});
    all_products = all_products.length;

    let out_of_stock_products = await Product.find({ stock: 0 });
    out_of_stock_products = out_of_stock_products.length;

    //Brands
    let brands = await Brand.find({});
    brands = brands.length;

    let category = await Category.find({});
    category = category.length;

    //Sliders
    let sliders = await Slider.find({});
    sliders = sliders.length;

    //Notifications
    let notification = await Notifications.find({});
    notification = notification.length; 


    // Order
    let confirmed_order = await Order.find({ order_status: 'confirmed' });
    confirmed_order = confirmed_order.length;

    let packed_order = await Order.find({ order_status: 'packed' });
    packed_order = packed_order.length;

    let shipped_order = await Order.find({ order_status: 'shipped' });
    shipped_order = shipped_order.length;

    let delivered_order = await Order.find({ order_status: 'delivered' });
    delivered_order = delivered_order.length;

    let cancelled_order = await Order.find({ order_status: 'cancelled' });
    cancelled_order = cancelled_order.length;

    let returned_order = await Order.find({ order_status: 'returned' });
    returned_order = returned_order.length;

    let pending_payments_order = await Order.find({ order_status: 'pending' });
    pending_payments_order = pending_payments_order.length;

    let failed_orders = await Order.find({ order_status: 'failed' });
    failed_orders = failed_orders.length;


    let all_orders = await Order.find({});
    all_orders = all_orders.length;

    var result = [
        {
            common: {
                all_user: all_user,
                active_user: active_user,
                pending_user: pending_user,
                medicine_request: medicine_request,
                today_offer: today_offer,
                discount_coupon: discount_coupon,
                all_products: all_products,
                out_of_stock_products: out_of_stock_products,
                brands: brands,
                category: category,
                sliders: sliders,
                notification: notification,
            },
            sales: {
                confirmed_order: confirmed_order,
                packed_order: packed_order,
                shipped_order: shipped_order,
                delivered_order: delivered_order,
                all_order: all_orders,
                cancelled_order: cancelled_order,
                returned_order: returned_order,
                pending_payments_order: pending_payments_order,
                failed_orders: failed_orders,
            }
        }
    ];

    var final = {
        res: "success",
        msg: "Dashboard countings.",
        data: result,
    };
    res.status(200).send(final);
});

module.exports = router;

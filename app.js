require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());

app.use(express.static("public"));


require("./database/db-config");

// API Routing

/*
------------------
WEBSITE API ROUTES
------------------
*/

const AdminLogin = require("./APIs/Web/admin-login");
const AddCategory = require("./APIs/Web/add-category");
const FileUploadNative = require("./APIs/Web/file-upload-native");
const AllCategory = require("./APIs/Web/all-category");
const AddBrand = require("./APIs/Web/add-brand");
const AllBrand = require("./APIs/Web/all-brand");
const AddProduct = require("./APIs/Web/add-product");
const AllProduct = require("./APIs/Web/all-products");
const AddSlider = require("./APIs/Web/add-slider");
const AllSlider = require("./APIs/Web/all-slider");
const AddState = require("./APIs/Web/add-state");
const AllState = require("./APIs/Web/all-state");
const AddDistrict = require("./APIs/Web/add-district");
const AllDistrict = require("./APIs/Web/all-district");
const GetProductDetail = require("./APIs/Web/product-details");
const SendNotification = require("./APIs/Web/send-notification");
const SentNotifications = require("./APIs/Web/sent-notifications");
const AllOrders = require("./APIs/Web/all-orders");
const OrderCompleteDeatils = require("./APIs/Web/order-details");
const Users = require("./APIs/Web/users");
const UsersNew = require("./APIs/Web/users-new-request");
const VerifyAccount = require("./APIs/Web/verify-account");
const DeleteAccount = require("./APIs/Web/delete-account");
const GetMedicineRequest = require("./APIs/Web/medicine-request");
const DeleteMedicineRequest = require("./APIs/Web/delete-request");
const DeleteEnquiry = require("./APIs/Web/delete-enquiry");
const OrderTrackingHistory = require("./APIs/Web/order-history");
const MarkAsFailed = require("./APIs/Web/mark-as-failed");
const AdminCancelOrder = require("./APIs/Web/mark-cancel");
const UpdateTrackingInfo = require("./APIs/Web/update-tracking");
const DeleteTrackRecord = require("./APIs/Web/delete-track-record");
const DeletePushNotification = require("./APIs/Web/delete-push");
const DeleteSlider = require("./APIs/Web/delete-slider");
const ChangeAdminPassword = require("./APIs/Web/change-admin-password");
const UpdateAdminEmail = require("./APIs/Web/update-email");
const AdminData = require("./APIs/Web/get-admin-data");
const UpdateCategory = require("./APIs/Web/edit-category");
const UpdateBrand = require("./APIs/Web/edit-brand");
const DeleteBrand = require("./APIs/Web/delete-brand");
const DeleteCategory = require("./APIs/Web/delete-category");
const DeleteProduct = require("./APIs/Web/delete-product");
const ToggleBrand = require("./APIs/Web/toggle-brand");
const ToggleCategory = require("./APIs/Web/toggle-category");
const ToggleProduct = require("./APIs/Web/toggle-product");
const ToggleCoupon = require("./APIs/Web/toggle-coupon");
const UpdateDeliery = require("./APIs/Web/update-date-of-delivery");
const UpdatePayment = require("./APIs/Web/update-payment");
const UpdateProduct = require("./APIs/Web/update-product");
const HandleReturnRequest = require("./APIs/Web/handle-return-request");
const OfferEntry = require("./APIs/Web/offer-entry");
const OfferAll = require("./APIs/Web/all-offer");
const DeleteOffer = require("./APIs/Web/delete-offer");
const CreateCoupon = require("./APIs/Web/create-coupon");
const AllCoupons = require("./APIs/Web/all-coupons");
const DeleteCoupon = require("./APIs/Web/delete-coupon");
const UpdateCoupon = require("./APIs/Web/update-coupon");
const DashboardStats = require("./APIs/Web/dashboard-stats");
const OrderByUserid = require("./APIs/Web/orders-by-userid");
const UserFilter = require("./APIs/Web/user-filter");
const WebView = require("./APIs/App/webviews"); 
const UpdateDoc = require("./APIs/Web/update-document");
const UpdateStock = require("./APIs/Web/update-stock");
const RejectAccount = require("./APIs/Web/rejected-account");
const RejectUserAccount = require("./APIs/Web/reject-account");
const ContactUs = require("./APIs/Web/contact-us");
const AllContact = require("./APIs/Web/all-contact");



  
/*
------------------
APP API ROUTES
------------------
*/
const RecentOrders = require("./APIs/App/recent-orders");
const Hello = require("./APIs/App/hello");
const GetSlider = require("./APIs/App/get-slider");
const GetBrand = require("./APIs/App/get-brand");
const GetCategory = require("./APIs/App/get-category");
const GetProductAll = require("./APIs/App/get-product-all");
const GetProductByCategory = require("./APIs/App/get-product-by-category");
const GetProductByBrand = require("./APIs/App/get-product-by-brand");
const GetState = require("./APIs/App/get-states");
const GetDistrict = require("./APIs/App/district-by-state");
const RegisterUser = require("./APIs/App/register-user");
const SendOtp = require("./APIs/App/send-otp");
const VerifyOTP = require("./APIs/App/verify-otp");
const ProductDetails = require("./APIs/App/product-details");
const StateStaic = require("./APIs/App/state-static");
const DistrictStatic = require("./APIs/App/district-static");
const AddToCart = require("./APIs/App/cart-add");
const GetCart = require("./APIs/App/show-all-cart");
const Wishlist = require("./APIs/App/wishlist");
const ShowWishlist = require("./APIs/App/show-wishlist");
const AddAddress = require("./APIs/App/add-address");
const GetAddress = require("./APIs/App/show-address");
const UpdateAddress = require("./APIs/App/update-address");
const DeleteAddress = require("./APIs/App/delete-address");
const Checkout = require("./APIs/App/order-checkout");
const SearchProduct = require("./APIs/App/search-product");
const UserDetails = require("./APIs/App/user-details");
const UserDetailsWEB = require("./APIs/Web/user-details");
const AddToWallet = require("./APIs/App/add-to-wallet");
const WalletResponse = require("./APIs/App/wallet-pay-response");
const WalletHistory = require("./APIs/App/wallet-history");
const OrderResponse = require("./APIs/App/order-payment-response");
const OrderPreview = require("./APIs/App/order-preview");
const OrderHistory = require("./APIs/App/order-history");
const OrderCompleteDeatils2 = require("./APIs/App/order-complete-details");
const UpdateProfile = require("./APIs/App/update-profile");
const CartCount = require("./APIs/App/cart-count");
const SaveToken = require("./APIs/App/save-token");
const CancelOrder = require("./APIs/App/cancel-order");
const ReturnOrder = require("./APIs/App/return-order");
const OrderTracking = require("./APIs/App/order-tracking");
const DeliveryFeedback = require("./APIs/App/delivery-feedback");
const MedicineRequest = require("./APIs/App/medicine-request");
const TodayOffer = require("./APIs/App/today-offer");
const OfferAllApp = require("./APIs/App/offer-all");
const AllCouponsApp = require("./APIs/App/all-coupons");
const AllCouponsAppWallet = require("./APIs/App/all-coupons-wallet");
const ValidateCoupon = require("./APIs/App/validate-coupon");
const ValidateCouponWallet = require("./APIs/App/validate-coupon-wallet");
const UpdateDocApp = require("./APIs/App/update-document");
const TrendingProduct = require("./APIs/App/trending-products");
const ContactDetails = require("./APIs/App/contact-details");
 

// Handline api call

/*
------------------
WEB
------------------
*/

app.use("/APIs/Web/", AdminLogin);
app.use("/APIs/Web/", AddCategory);
app.use("/APIs/Web/", FileUploadNative);
app.use("/APIs/Web/", AllCategory);
app.use("/APIs/Web/", AllBrand);
app.use("/APIs/Web/", AddBrand);
app.use("/APIs/Web/", AddProduct);
app.use("/APIs/Web/", AllProduct);
app.use("/APIs/Web/", AddSlider);
app.use("/APIs/Web/", AllSlider);
app.use("/APIs/Web/", GetProductDetail);
app.use("/APIs/Web/", AddState);
app.use("/APIs/Web/", AllState);
app.use("/APIs/Web/", AddDistrict);
app.use("/APIs/Web/", AllDistrict);
app.use("/APIs/Web/", SendNotification);
app.use("/APIs/Web/", SentNotifications);
app.use("/APIs/Web/", AllOrders);
app.use("/APIs/Web/", OrderCompleteDeatils);
app.use("/APIs/Web/", Users);
app.use("/APIs/Web/", UserDetailsWEB);
app.use("/APIs/Web/", VerifyAccount);
app.use("/APIs/Web/", DeleteAccount); 
app.use("/APIs/Web/", GetMedicineRequest);
app.use("/APIs/Web/", DeleteMedicineRequest);
app.use("/APIs/Web/", DeleteEnquiry);
app.use("/APIs/Web/", OrderTrackingHistory);
app.use("/APIs/Web/", MarkAsFailed);
app.use("/APIs/Web/", AdminCancelOrder);
app.use("/APIs/Web/", UpdateTrackingInfo);
app.use("/APIs/Web/", DeleteTrackRecord);
app.use("/APIs/Web/", DeletePushNotification);
app.use("/APIs/Web/", DeleteSlider);
app.use("/APIs/Web/", ChangeAdminPassword);
app.use("/APIs/Web/", UpdateAdminEmail);
app.use("/APIs/Web/", AdminData);
app.use("/APIs/Web/", UpdateCategory);
app.use("/APIs/Web/", UpdateBrand);
app.use("/APIs/Web/", DeleteBrand);
app.use("/APIs/Web/", DeleteCategory);
app.use("/APIs/Web/", ToggleBrand);
app.use("/APIs/Web/", ToggleCategory);
app.use("/APIs/Web/", ToggleProduct);
app.use("/APIs/Web/", ToggleCoupon);
app.use("/APIs/Web/", DeleteProduct);
app.use("/APIs/Web/", UpdateDeliery);
app.use("/APIs/Web/", UpdatePayment);
app.use("/APIs/Web/", UpdateProduct);
app.use("/APIs/Web/", HandleReturnRequest);
app.use("/APIs/Web/", OfferEntry);
app.use("/APIs/Web/", OfferAll);
app.use("/APIs/Web/", DeleteOffer);
app.use("/APIs/Web/", CreateCoupon);
app.use("/APIs/Web/", AllCoupons);
app.use("/APIs/Web/", DeleteCoupon);
app.use("/APIs/Web/", UpdateCoupon); 
app.use("/APIs/Web/", DashboardStats); 
app.use("/APIs/Web/", OrderByUserid); 
app.use("/APIs/Web/", UserFilter); 
app.use("/APIs/Web/", UpdateDoc); 
app.use("/APIs/Web/", UpdateStock); 
app.use("/APIs/Web/", RejectAccount); 
app.use("/APIs/Web/", RejectUserAccount); 
app.use("/APIs/Web/", ContactUs); 
app.use("/APIs/Web/", AllContact); 

    
/*  
------------------
APP
------------------
*/
app.use("/APIs/App/", ContactDetails); 
app.use("/APIs/App/", Hello);
app.use("/APIs/App/", GetSlider);
app.use("/APIs/App/", GetBrand);
app.use("/APIs/App/", GetCategory);
app.use("/APIs/App/", GetProductAll);
app.use("/APIs/App/", GetProductByCategory);
app.use("/APIs/App/", GetProductByBrand);
app.use("/APIs/App/", GetState);
app.use("/APIs/App/", GetDistrict);
app.use("/APIs/App/", RegisterUser);
app.use("/APIs/App/", SendOtp);
app.use("/APIs/App/", VerifyOTP);
app.use("/APIs/App/", ProductDetails);
app.use("/APIs/App/", StateStaic);
app.use("/APIs/App/", DistrictStatic);
app.use("/APIs/App/", AddToCart);
app.use("/APIs/App/", GetCart);
app.use("/APIs/App/", Wishlist);
app.use("/APIs/App/", ShowWishlist);
app.use("/APIs/App/", AddAddress);
app.use("/APIs/App/", GetAddress);
app.use("/APIs/App/", UpdateAddress);
app.use("/APIs/App/", DeleteAddress);
app.use("/APIs/App/", Checkout);
app.use("/APIs/App/", SearchProduct);
app.use("/APIs/App/", UserDetails);
app.use("/APIs/App/", AddToWallet);
app.use("/APIs/App/", WalletResponse);
app.use("/APIs/App/", WalletHistory);
app.use("/APIs/App/", OrderResponse);
app.use("/APIs/App/", OrderPreview);
app.use("/APIs/App/", OrderHistory);
app.use("/APIs/App/", OrderCompleteDeatils2);
app.use("/APIs/App/", UpdateProfile);
app.use("/APIs/App/", CartCount);
app.use("/APIs/App/", SaveToken);
app.use("/APIs/App/", SentNotifications);
app.use("/APIs/App/", CancelOrder);
app.use("/APIs/App/", ReturnOrder);
app.use("/APIs/App/", OrderTracking);
app.use("/APIs/App/", DeliveryFeedback);
app.use("/APIs/App/", MedicineRequest);
app.use("/APIs/App/", TodayOffer);
app.use("/APIs/App/", OfferAllApp);
app.use("/APIs/App/", AllCouponsApp);
app.use("/APIs/App/", AllCouponsAppWallet);
app.use("/APIs/App/", ValidateCoupon);
app.use("/APIs/App/", ValidateCouponWallet);
app.use("/APIs/App/", UpdateDocApp);
app.use("/APIs/App/", WebView); 
app.use("/APIs/App/", UsersNew); 
app.use("/APIs/App/", RecentOrders);  
app.use("/APIs/App/", TrendingProduct); 

 

//Accessing static (uploaded) files in node js
app.use("/public/uploads/category/", express.static("public/uploads/category"));
app.use("/public/uploads/brand/", express.static("public/uploads/brand"));
app.use("/public/uploads/slider/", express.static("public/uploads/slider"));
app.use("/public/uploads/product/", express.static("public/uploads/product"));
app.use("/public/uploads/docs/", express.static("public/uploads/docs"));
  
/*
--------------------
Starting server on PORT
---------------------
*/
 
app.listen(port, function () {
  console.log(`Server started at port ${port}.`);
});

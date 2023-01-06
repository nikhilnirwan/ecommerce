const { json } = require("express");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Order = require("./../../models/Web/order.schema");
const Cart = require("./../../models/Web/cart.schema");
const Wishlist = require("./../../models/Web/wishlist.schema");
const Product = require("./../../models/Web/product.schema");
const User = require("./../../models/Web/user.schema"); 
const { parse } = require("dotenv");
const upload = multer();

const CheckUserID = async(userid) => {
	
	const users = await User.find({ _id: userid});
	return users;
}

const UserOrders = async(userid) => {
  const orders = await Order.find({user_id: userid});
   
  return orders;
}

const RecentOrderedItem = async(userid) => {
  const items = await Cart.find({user_id: userid, status: true, order_id: {$ne: "0"}});
  var return_arr = [];
  if(items.length>0)
  {
	const items_parsed = JSON.parse(JSON.stringify(items));
	
	for (element of items_parsed)
	{
		return_arr.push({product_id: element.product_id, quantity: element.quantity});
	}
  }
  
  //show most ordered products
  return_arr.sort(function(a, b) {
	  return b.quantity - a.quantity;
  });
  //show only intial 2 records
  var final_arr = [];
  
  for(each of return_arr)
  {
	if(final_arr.includes(each.product_id))
	{
	  
	}
	else
	{
		final_arr.push(each.product_id);
	}
  }
  
  final_arr = final_arr.slice(0,10);
  
 
  return final_arr;
}

const CheckInCart = async(product_id, user_id) => {
  var details = {in_cart: false, qty: 0};
  
  await Cart.findOne({
	user_id: user_id,
	product_id: product_id,
	status: false,
  })
  .exec().then((doc) => {
	if (doc) {
		console.log(doc);
	  details.in_cart = true; 
	  details.qty = doc.quantity;
	}
  });
   
  return details;
}

const CheckInWishlist = async(product_id, user_id) => {
	const items = await Wishlist.find({user_id: user_id, product_id: product_id});
	
	if(items.length>0)
	{
	  return true;
	}
	else
	{
	  return false;
	}
}

const GetProducts = async(ids_array, user_id) => {
  var products = await Product.find().where('_id').in(ids_array).populate("category").populate("brand").exec();
  
  products = JSON.parse(JSON.stringify(products));
  
  for(element of products)
  {
	var response = await CheckInCart(element._id, user_id);
	element.in_cart = response.in_cart;
	element.cart_count = response.qty;
	
	var response_wish = await CheckInWishlist(element._id, user_id);
	element.in_wishlist = response_wish;
 
	element.image1 = process.env.BASEURL + "public/uploads/product/" + element.image1;
  }
    
  return products;
}
  
router.post("/recent-orders", upload.none(),async function (req, res, next) {
	if(req.body)
	{
		const order = new Order(req.body);
		var err = order.orderPreview(req.body);
		  
		if (err.error) {
			var final = {
				res: "error",
				msg: err.error.details[0].message,
			};
			res.status(400).send(final);
			} else {
			
			var users = await CheckUserID(req.body.user_id);
			
			if(users.length>0)
			{ 
			  //get all orders of user
			  const recents = await RecentOrderedItem(req.body.user_id);
			  if(recents.length>0)
			  {
				const list = await GetProducts(recents, req.body.user_id);
				 
				var final = {
					res: "success",
					msg: list.length+" Recent ordered products found!",
					data: list
				};
				res.status(200).send(final);
			  }
			  else
			  {
				var final = {
					res: "error",
					msg: "No recent order found!",
				};
				res.status(400).send(final);
			  }
			  
			}
			else
			{
			  var final = {
				  res: "error",
				  msg: "User ID is invalid!",
			  };
			  res.status(400).send(final);
			}
		}
	}
	else
	{
		var final = {
			res: "error",
			msg: "Request body should not remains empty!",
		};
		res.status(400).send(final);
	}
	
});

module.exports = router;

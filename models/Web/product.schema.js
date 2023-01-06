const { string, number } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

/*
    ------------------
    Product Schema
    ------------------
*/

var productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    brand: {
        type: String,
        required: true,
        ref: "Brand",
    },
    stock: {
        type: Number,
        required: true,
    },
    mrp: {
        type: String,
        required: true,
    },
    offerprice: {
        type: String,
        required: true,
    },
    discount: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    added_on: {
        type: String,
        required: true,
    },
    image1: {
        type: String,
    },
    image2: {
        type: String,
    },
    image3: {
        type: String,
    },
    image4: {
        type: String,
    },
    expiry: {
        type: String,
    },
    pack_info: {
        type: String,
    },
    compositon: {
        type: String,
    },
    allowed_cert: {
        type: String,
    },
    in_cart: {
        type: String,
    },
    cart_count: {
        type: Number,
    },
    in_wishlist: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    }
});

productSchema.methods.productDetails = function (obj) {
    var schema = Joi.object({
        product_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .label("Product ID")
        .messages({
            "any.required": "Product ID must not be empty!",
            "string.pattern.base": "Product ID is not valid!",
        }),
    });
    
    const validation = schema.validate(obj);
    
    return validation;
};

productSchema.methods.joiValidateDelete = function (obj) {
    var schema = Joi.object({
        id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .label("Product ID")
        .messages({
            "any.required": "Product ID must not be empty!",
            "string.pattern.base": "Product ID is not valid!",
        }),
    });
    
    const validation = schema.validate(obj);
    
    return validation;
};


productSchema.methods.joiValidateUpdateStock = function (obj) {
    var schema = Joi.object({
        id: Joi.string() 
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .label("Product ID")
        .messages({
            "any.required": "Product ID must not be empty!",
            "string.pattern.base": "Product ID is not valid!",
        }), 
        stock: Joi.string().required().label("Stock").messages({
            "any.required": "Stock must not be empty!",
        }), 
        batch_id: Joi.string().required().label("Batch ID").messages({
            "any.required": "Batch ID must not be empty!",
        }),
    });
  
    const validation = schema.validate(obj);
    
    return validation;
};






productSchema.methods.joiValidateToggle = function (obj) {
    var schema = Joi.object({
        id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .label("Product ID")
        .messages({
            "any.required": "Product ID must not be empty!",
            "string.pattern.base": "Product ID is not valid!",
        }),
    });
    
    const validation = schema.validate(obj);
    
    return validation;
};

productSchema.methods.searchProduct = function (obj) {
    var schema = Joi.object({
        keyword: Joi.string().required().label("Search Keyword").messages({
            "any.required": "Search keyword must not be empty!",
        }),
        user_id: Joi.string().required().label("User ID").messages({
            "any.required": "User ID must not be empty!",
        }),
    });
    
    const validation = schema.validate(obj);
    
    return validation;
};

productSchema.methods.joiValidate = function (obj) {
    var schema = Joi.object({
        name: Joi.string().required().label("Name").messages({
            "any.required": "Product name should not be empty!",
        }),
        category: Joi.string().required().label("Category").messages({
            "any.required": "Category should not be empty!",
            "String.empty": "Category should not be empty!",
        }),
        brand: Joi.string().required().label("Brand").messages({
            "any.required": "Brand should not be empty!",
            "String.empty": "Brand should not be empty!",
        }),
        stock: Joi.number().required().label("Stock").messages({
            "any.required": "Stock should not be empty!",
            "number.empty": "Stock should not be empty!",
        }),
        mrp: Joi.string().required().label("MRP").messages({
            "any.required": "MRP should not be empty!",
            "String.empty": "MRP should not be empty!",
        }),
        offerprice: Joi.string().required().label("Offer Price").messages({
            "any.required": "Offer Price should not be empty!",
            "String.empty": "Offer Price should not be empty!",
        }),
        discount: Joi.string().required().label("Discount").messages({
            "any.required": "Discount should not be empty!",
            "String.empty": "Discount should not be empty!",
        }),
        details: Joi.string().required().label("Details").messages({
            "any.required": "Details should not be empty!",
            "String.empty": "Details should not be empty!",
        }),
        expiry: Joi.string().required().label("Expiry").messages({
            "any.required": "Expiry should not be empty!",
            "String.empty": "Expiry should not be empty!",
        }),
        pack_info: Joi.string().required().label("Expiry").messages({
            "any.required": "Pack info should not be empty!",
            "String.empty": "Pack info should not be empty!",
        }),
        compositon: Joi.string().required().label("Expiry").messages({
            "any.required": "Compositon should not be empty!",
            "String.empty": "Compositon should not be empty!",
        }),
        allowed_cert: Joi.string().required().label("Expiry").messages({
            "any.required": "Compositon should not be empty!",
            "String.empty": "Compositon should not be empty!",
        }),
    });
    
    const validation = schema.validate(obj);
    
    return validation;
};


productSchema.methods.joiValidateEdit = function (obj) {
    var schema = Joi.object({
        id: Joi.string().required().label("ID").messages({
            "any.required": "Product ID should not be empty!",
        }),
        name: Joi.string().required().label("Name").messages({
            "any.required": "Product name should not be empty!",
        }),
        category: Joi.string().required().label("Category").messages({
            "any.required": "Category should not be empty!",
            "String.empty": "Category should not be empty!",
        }),
        brand: Joi.string().required().label("Brand").messages({
            "any.required": "Brand should not be empty!",
            "String.empty": "Brand should not be empty!",
        }),
        stock: Joi.number().required().label("Stock").messages({
            "any.required": "Stock should not be empty!",
            "number.empty": "Stock should not be empty!",
        }),
        mrp: Joi.string().required().label("MRP").messages({
            "any.required": "MRP should not be empty!",
            "String.empty": "MRP should not be empty!",
        }),
        offerprice: Joi.string().required().label("Offer Price").messages({
            "any.required": "Offer Price should not be empty!",
            "String.empty": "Offer Price should not be empty!",
        }),
        discount: Joi.string().required().label("Discount").messages({
            "any.required": "Discount should not be empty!",
            "String.empty": "Discount should not be empty!",
        }),
        details: Joi.string().required().label("Details").messages({
            "any.required": "Details should not be empty!",
            "String.empty": "Details should not be empty!",
        }),
        expiry: Joi.string().required().label("Expiry").messages({
            "any.required": "Expiry should not be empty!",
            "String.empty": "Expiry should not be empty!",
        }),
        pack_info: Joi.string().required().label("Expiry").messages({
            "any.required": "Pack info should not be empty!",
            "String.empty": "Pack info should not be empty!",
        }),
        compositon: Joi.string().required().label("Expiry").messages({
            "any.required": "Compositon should not be empty!",
            "String.empty": "Compositon should not be empty!",
        }),
        allowed_cert: Joi.string().required().label("Expiry").messages({
            "any.required": "Compositon should not be empty!",
            "String.empty": "Compositon should not be empty!",
        }),
    }).unknown(true);
    
    const validation = schema.validate(obj);
    
    return validation;
};

module.exports = mongoose.model("Product", productSchema);

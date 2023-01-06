const { string, number } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

/*
    ------------------
    Batch Schema
    ------------------
*/

var batchSchema = mongoose.Schema({
    product_id: {
        type: String,
        required: true,
    },
	batch_id: {
		type: String,
        required: true,
	},
	date_time: {
		type: String,
        required: true,
	},
	stock: {
		type: String,
        required: true,
	}
});


module.exports = mongoose.model("Batch", batchSchema);

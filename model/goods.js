var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Goods = new Schema({
	goodsname : String,
	goodsnum : Number,
	goodsprice:Number,
	goodsshop:Number,
	date : {type:Date,default : Date.now}
})
var goodsModel = mongoose.model("good",Goods);
module.exports = goodsModel;
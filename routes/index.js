var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var UserModel = require("../model/User");
var GoodsModel = require("../model/goods");
var md5 = require("md5");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: '注册页面' });
});

router.get('/log', function(req, res, next) {
  res.render('log', { title: '登录页面' });
});
router.get('/index2', function(req, res, next) {
  res.render('index2', { title: '主界面' });
});


router.post("/api/log4ajax", function(req, res, next) {
	var username = req.body.username;
  var psw = req.body.psw;
    var result = {
  			code:1,
  			message:"登陆成功"
  	};
  UserModel.find({username:username,psw:md5(psw)},(err,docs)=>{
  	if(docs.length == 0){
  		result.code = -101;
  		result.message = "您的账户或密码错误"
  	}
  	res.json(result);
  })
})

router.post("/api/login4ajax", function(req, res, next) {
  var username = req.body.username;
  var psw = req.body.psw;
  var result = {
  			code:1,
  			message:"注册成功"
  };
  
  //检查用户名是否被使用
	UserModel.find({username:username,psw:md5(psw)},function(err,docs){
		if(docs.length > 0){
			result.code = -109;
			result.message = "您的用户名已被注册，请选择其他用户名";
			res.json(result);
			return;
		}
		var um = new UserModel();
	  um.username = username;
	  um.psw = md5(psw);
	  um.save(function(err){
	  	if(err){
	  		result.code = -100;
	  		result.message("注册失败")
	  		res.send("注册失败");
	  	}else{
	  		res.json(result);
	  	}
	  }) 
	})
  
});

router.post('/api/addgoods4ajax', function(req, res, next) {
	var goodsname = req.body.goodsname;
	var goodsnum = req.body.goodsnum;
	var goodsprice = req.body.goodsprice;
	var goodsshop = req.body.goodsshop;
	var result = {
  			code:1,
  			message:"添加成功"
 }
  GoodsModel.find({goodsname:goodsname},function(err,docs){
  	if(docs.length>0){
  		result.code = -119;
  		result.message = "此商品已存在";
  		res.json(result);
  		return
  	} 
  	var re = new GoodsModel();
  	re.goodsname = goodsname;
  	re.goodsnum = goodsnum;
  	re.goodsprice = goodsprice;
  	re.goodsshop = goodsshop;
  	re.save(function(err){
  		if(err){
  			result.code = -199;
  			result.message = "商品添加失败"
  		}
  		res.json(result);
  	})
  });
  	
});

router.post("/lb4ajax",function(req,res){
	var keyWord =req.body.keyWord;
	var pageNow = Number(req.body.pageNow);
	var pageRecord = Number(req.body.pageRecord);
	var operate = GoodsModel.find({"goodsname":{$regex:keyWord}});
	operate.skip((pageNow - 1)*pageRecord);
	operate.limit(pageRecord);
		operate.exec(function(err,docs){
			GoodsModel.count({"goodsname":{$regex:keyWord}},function(err,count){
				console.log("数量"+count);
				console.log(docs);
				res.json({res:docs,count});
			})
		})
})



module.exports = router;

var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1",1984,"admin","admin");

var fileName = "";

client.execute("OPEN Colenso");

/* GET home page. */
router.get("/",function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
		" (//name[@type='place'])[1] ",
		function (error, result) {
			if(error){ console.error(error);
		}
			else {
				console.log(req.query.searchString);
				res.render('index', { title: 'The Colenso Project'});

			}
		});
});

/*display all db items*/

client.execute("XQUERY db:list('Colenso')", function (error,result){

});

router.get("/browse",function(req,res) {
	client.execute("XQUERY db:list('Colenso')",
		function (error,result) {
			if(error){
				console.error(error);
			} else{
				res.render('browse',{title:'Browse Our Collection', results:result.result.split("\n")});
			}
		});
});

router.get("/add",function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
		" (//name[@type='place'])[1] ",
		function (error, result) {
			if(error){ console.error(error);
		}
			else {
				console.log(req.query.searchString);
				res.render('index', { title: 'Add To Our Collection'});

			}
		});
});

router.get("/search",function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
		" (//name[@type='place'])[1] ",
		function (error, result) {
			if(error){ console.error(error);
		}
			else {
				console.log(req.query.searchString);
				res.render('index', { title: 'Search Our Collection'});

			}
		});
});

module.exports = router;
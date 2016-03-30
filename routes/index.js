var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1",1984,"admin","admin");

var xmls = null;
var loc = [];
var places = [];
var colenso = [];
var diary = [];
var newspaper = [];
var private = [];
var haast = [];
var hadfield = [];
var hDiary = [];
var hPrivate = [];
var hector = [];
var holmes = [];
var hooker = [];
var mclean = [];
var other = [];
var fileName = "";

/**/

client.execute("OPEN Colenso");

client.execute("XQUERY db:list('Colenso')", function (error,result){
	if(error){
		console.error(error);
	}
	else{
		var xmlResults = result.result;
		xmls = xmlResults.split("\n");
		for (var i=0; i<xmls.length;i++){
			var res = xmls[i].split("/");
			loc.push(res[0]);
			if(res[0]==="Haast"){
				haast.push(xmls[i]);
  			}
  			else if(res[0]==="Colenso"){
  				colenso.push(xmls[i]);
  				var res2 = xmls[i].split("/");
  				if(res2[1]==="diary"){
  					diary.push(xmls[i]);
  				}
  				else if(res2[1]==="newspaper_letters"){
  					newspaper.push(xmls[i]);
  				}
  				else{
  					private.push(xmls[i]);
  				}
  			}
  			else if(res[0]==="Hadfield"){
  				hadfield.push(xmls[i]);
  				var res2 = xmls[i].split("/");
  				if(res2[1]==="diary"){
  					hDiary.push(xmls[i]);
  				}
  				else{
  					hPrivate.push(xmls[i]);
  				}
  			}
  			else if(res[0]==="Hector"){
  				hector.push(xmls[i]);
  			}
  			else if(res[0]==="Holmes"){
  				holmes.push(xmls[i]);
  			}
  			else if(res[0]==="Hooker"){
  				hooker.push(xmls[i]);
  			}
  			else if(res[0]==="McLean"){
  				mclean.push(xmls[i]);
  			} else{
  				other.push(xmls[i]);
  			}
		}
	}

});

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

router.get("/browse",function(req,res) {

    var queries = req.query;
    var path = "";
    var depth = 0;

    if (queries.path != undefined) {
        path = queries.path;
        depth = path.split('/').length;
        path = path + '/';
    }

    client.execute("XQUERY for $p in collection('Colenso/" + path + "') return db:path($p)",
        function (error, result) {
            if (error) {
                console.error(error);
            } else {
                var results = result.result.split('\n');
                var folders = [];
                var files = [];

                for (var i = 0; i < results.length; i += 1) {
                    if (results[i].split('/')[depth].indexOf('.xml') < 0) {
                        folders.push(path + results[i].split('/')[depth]);
                    } else {
                        files.push(results[i].split('/')[depth]);
                    }
                }

                var unique_folders = [];

                for (var i = 0; i < folders.length; i += 1) {
                    if (unique_folders.indexOf(folders[i]) < 0) {
                        unique_folders.push(folders[i]);
                    }
                }
                res.render('browse', {title: 'Browse Our Collection', path: path, folders: unique_folders, files: files});
            }
    })
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
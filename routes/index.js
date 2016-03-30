var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1",1984,"admin","admin");

var fileName = "";
var tei =  "XQUERY declare default element namespace 'https://www.tei-c.org/ns/1.0';";

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

router.get('/search', function(req, res){
    res.render('search', {title: 'Search Our Collection'});
});

router.get("/searchStr",function(req,res){
	var input = decodeURI(req.query.stringsearch);

    input = input.replace("AND", '\' ftand \'').replace("OR", '\' ftor \'').replace("NOT", '\' ftnot \'');

    if(input){
        client.execute(tei + "for $t in *[.//text() contains text '" + input + "' using wildcards] return db:path($t)", function(error, result){
            if(error){
                console.log(error);
            }
            else{
                var files = result.result.split('\r\n');
                res.render('searchResults', {title: 'Search Our Collection', files: files, search: input, matches: files.length});
            }
        });
    }
    else{
        res.render('search', {title: 'Search Our Collection'});
    }
});

router.get("/searchXQ",function(req,res){
	var input = req.query.xquerysearch;
    if(input){
        client.execute((tei + "for $t in (collection('Colenso/')"+ input +")" + "return db:path($t)"), function(error, result){
           if(error){
               console.log(error);
           }
           else{
               var files = result.result.split('\n');
               res.render('searchResults', {title: 'Search Our Collection', files: files, search: input, matches: files.length});
           }
        });
    }
    else{
        res.render('search', {title: 'Search Our Collection'});
    }
});

router.get("/viewFile",function(req,res){
	client.execute(tei+"(doc('Colenso/"+req.query.file+"'))[1]",function(error,result){
		if(error){
			console.log(error);
		}
		else{
			fileName = req.query.file
			res.render('viewFile',{title:'Search Our Collection', fileName: fileName,file: result.result});
		}
	});
});

router.get("/viewRaw",function(req,res){
	client.execute(tei + "(doc('Colenso/"+fileName+"'))[1]", function (error, result) {
		if(error){
	   		console.error(error);
	  	}
		else {
			res.render('viewRaw', {title:'Browse Our Collection', fileName: req.query.file,file: result.result});
	 }
	});
});

router.get("/download",function(req,res){
	client.execute(tei+"(doc('Colenso/"+fileName+"'))[1]", function (error, result) {
    	if(error){
        	console.error(error);
        }
        else {
        	res.writeHead(200, {
          	'Content-Type': 'application/force-download','Content-disposition': 'attachment; filename=' + fileName,
        });
		res.write(result.result);
        res.end();
    }});
});	

module.exports = router;
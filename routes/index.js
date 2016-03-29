var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1",1984,"admin","admin");

/**/

client.execute("OPEN Colenso");
client.execute("XQUERY declare namespace tei= 'http://www.tei-c.org/ns/1.0'; " +
"//tei:name[@type = 'place' and position() = 1 and . = 'Manawarakau']",
	function(err, res) {
	if(!err) {
		console.error(res.result);
	}
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

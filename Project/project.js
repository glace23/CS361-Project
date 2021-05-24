var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require('path')

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 30244);

// post
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Main page
app.get('/css', function(req,res){
      var options = { 
        root: path.join(__dirname + "/public/css") 
    }; 
  res.sendFile("style.css", options);
});

app.get('/naviscript', function(req, res){
    var options = { 
        root: path.join(__dirname + "/public/js") 
    }; 
    res.sendFile("navibar.js", options);
});

// HOME Page
app.get('/homescript', function(req, res){
    var options = { 
        root: path.join(__dirname + "/public/js") 
    }; 
    res.sendFile("slide.js", options);
});

app.get('/',function(req,res){

  for (var name in req.query){
  	if (name == 'city'){
  		var city = req.query[name]
  	}
  	else if (name == 'state'){
  		var state = req.query[name]
  	}
  }
  	var context = {dataList:null}
 //  	let text = {city:null, state:null}
 //  if (typeof city != "undefined" && typeof state != "undefined"){
	// var xml = new XMLHttpRequest();

	// text.city = city
	// text.state = state
	// xml.open('POST', 'http://127.0.0.1:5000/', true);
	// xml.setRequestHeader('Content-Type', 'application/json');
	// xml.send(JSON.stringify(text));
	// xml.onreadystatechange = function () {
	// if(xml.readyState == 4 && xml.status >= 200 && xml.status < 400){
	// 	var response = JSON.parse(xml.responseText);
	// 	context.dataList = response
	// } 
	// else {
	// 	console.log("Error in network request: ")
	// }}}
	
  res.render('home')
});


//contact
app.get('/showscript', function(req, res){
    var options = { 
        root: path.join(__dirname + "/public/js") 
    }; 
    res.sendFile("show.js", options);
});

app.get('/calc',function(req,res){
  res.render('calc')
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
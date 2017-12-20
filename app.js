var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var expressValidator = require('express-validator');
var mongojs= require('mongojs');
var db= mongojs('node_mongo_app',['users']);
var ObjectId=mongojs.ObjectId;

var app=express();


// View engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':false}));


// set static path(used for static resorces for app like css jquery etc)
// __dirname is used for getting current dir
app.use(express.static(path.join(__dirname,'public'))); 


// Global vars middleware
app.use(function(req,res,next) {
	
	res.locals.errors = null;
	res.locals.result = null;
	next();

});

// Express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));


/*
// parsing json demo
var persons=[
		{
			name:'Awais',
			age: 12
		},
		{
			name:'Aslam',
			age: 14
		},
		{
			name:'Akhter',
			age: 90
		}
	];

	*/

// used for get requests
app.get('/',function(req,res) {
	
	// res.json(persons);
	// res.send('hello yakko world!');

	db.users.find(function (err, docs) {
		
		res.render('index',{
			title:'Customers',
			users:docs
		});

	});
	


});



app.post('/users/add',function(req,res) {
	// get data from form
	req.checkBody('first_name','first name is required!').notEmpty();
	req.checkBody('last_name','last name is required!').notEmpty();
	req.checkBody('email','email is required!').notEmpty();
	var errors=req.validationErrors();

	if(errors){


		db.users.find(function (err, docs) {

			res.render('index',{
				title:'Customers',
				users:docs,
				errors:errors
			});

		});
		
		console.log('an error occured');
		
	}else{

		var newuser={
			first_name : req.body.first_name,
			last_name : req.body.last_name,
			email : req.body.email
		};

		db.users.insert(newuser, function(err,result) {
			
			if(err){
				console.log(err);
			}

			res.redirect('/');

		});

		console.log('Success');

	}
});

app.delete('/users/delete/:id',function(req,res) {
	db.users.remove({_id: ObjectId(req.params.id)});
	if(err){
		console.log(err);
	}

	res.redirect('/');

});

app.listen(8080,function(){
	console.log('Server is listening at port 8080...yoo baayyy!');
});
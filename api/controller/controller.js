'use strict';

var mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcryptjs'),
  	user = mongoose.model('users');

//register a new user
exports.register = function(req, res) {

  if(!req.body.email || !req.body.password || !req.body.name) 
  	return res.status(400).send({message: "Missing mandatory parameters"});
  
  //check if the user already exists first
  user.findOne({email : req.body.email}, function(err, foundUser){
  	if(foundUser) return res.status(400).send({message : "User with email ID - "+foundUser.email+" already exists."});
  	else{
	  //encrypt password before storing in database
	  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

	  //save the user to database
	  user.create({
	  	name: req.body.name,
	  	email: req.body.email,
	  	password: hashedPassword
	  }, function(err , user) {
	  	if (err) 
	  		return res.status(500).send({message : "There was a problem registering the user."});
	    res.status(201).send({ message: "User created succussfully" });
	  })
  	}
  })
}

//login to the application
exports.login = function(req, res) {

	if(!req.body.email || !req.body.password) return res.status(400).send({message: "Missing email or password value"});

	user.findOne({email : req.body.email}, function (err, user) {
	  if (err) return res.status(500).send({message : "There was a problem finding the user."});
	  if (!user) return res.status(404).send({message : "User does not exist."});	  
	  if(!bcrypt.compareSync(req.body.password, user.password))
	  	return res.status(200).send({message : "Incorrect password. Please retry."});	  

	  // create a token
      var token = jwt.sign({ id: user._id }, 'sampleSecretKey', {
		expiresIn: 86400 // expires in 24 hours
      });
	  res.status(200).send({auth : true , token : token});
	});   

}

//retrieve all users list
exports.getUserList = function(req, res) {

  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });  
  user.find({}, function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};
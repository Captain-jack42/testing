const Package = require("../models/booking-package");
const Feedback = require("../models/feedback");
const path = require('path');
const Signup = require("../models/Signup");


exports.postFeedback = (req,res,next) =>{
  console.log(req.body);
  const {name,email,phone,subject,message} = req.body;
  
  const feedback = new Feedback(name,email,phone,subject,message);
  feedback.save();
  res.sendFile(path.join(__dirname , '../' , 'view','contact.html'));
}

exports.postBookedPackage=(req,res,next) =>{
  const {service,duration,amount} = req.body;
  const package = new Package(service,duration,amount);
  package.save();
  res.sendFile(path.join(__dirname , '../' , 'view','payment.html'));
}

exports.postSignup=(req,res,next)=>{
  const {fullname,email,phone,password} = req.body;
  const acc = new Signup(fullname,email,phone,password) ;
  acc.save();
  res.sendFile(path.join(__dirname , '../' , 'view','Login.html'));
  
};

exports.postLogin = async (req, res, next) => {
  try {
    const accounts = await Signup.fetchAll();
    
    
    const matchingAccount = accounts.find(account => 
      account.email === req.body.email && 
      account.password === req.body.password
    );

    if (matchingAccount) {
      res.sendFile(path.join(__dirname , '../' , 'view','home.html'));
    } else {
      res.sendFile(path.join(__dirname , '../' , 'view','login.html'));
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error during login');
  }
};
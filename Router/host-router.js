const express = require('express');
const hostrouter =  express.Router();
const hostcontroller = require('../controller/host');
const path = require('path');
hostrouter.post("/submit-contact",hostcontroller.postFeedback);

hostrouter.post("/booking-package",hostcontroller.postBookedPackage);

hostrouter.post("/signup",hostcontroller.postSignup);

hostrouter.post("/Login",hostcontroller.postLogin);

  module.exports = hostrouter;


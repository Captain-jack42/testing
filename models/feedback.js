const { getDB } = require('../util/database');

module.exports = class Feedback{
  constructor(name,email,phone,subject,message){
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.subject = subject; 
    this.message = message;
  }
  
  save(){
    const db = getDB();
    const addfeedback = {
      name : this.name,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message : this.message,
    };
      return db.collection('feedback').insertOne(this);
    
  }

  }
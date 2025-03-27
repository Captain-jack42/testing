// const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');

module.exports = class Signup{
  constructor(fullname,email,phone,password,confirmPassword){
    this.fullname = fullname;
    this.email = email;
    this.phone = phone;
    this.password = password;
  }
  
  async save(){
    try {
      const db = getDB();
      return await db.collection('account').insertOne(this);
    } catch (error) {
      console.error('Database save error:', error);
      throw error;
    }
  }

  static async fetchAll(){
    try {
      const db = getDB();
      return await db.collection('account').find().toArray();
    } catch (error) {
      console.error('Database fetch error:', error);
      throw error;
    }
  }

}

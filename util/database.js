const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const url = `mongodb+srv://rajansingh8593:rajan123@captanjack.rr7lw.mongodb.net/?retryWrites=true&w=majority&appName=Captanjack`;

let _db;

const mongoConnect = (callback)=>{
  MongoClient.connect(url)
  .then((client)=>{
    console.log("Connected to Database"); 
    _db = client.db('yatra');
    callback(client);
  })
  .catch((err)=>{
    console.log(err);
  });
};

const getDB = () =>{
  if(!_db){
    throw new Error('mongo not connected');
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
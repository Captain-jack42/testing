const fs = require('fs');
const path = require('path');
const rootDir = require('../util/pathUtil');
const { error } = require('console');

module.exports = class Package{
  constructor(service,duration,amount){
    this.service = service;
    this.duration = duration;
    this.amount = amount;
  }

  save(){
    Home.fetchAll((bookedpackage)=>{
      bookedpackage.push(this);
      const packageDataPath = path.join(rootDir,'data','package.json');
      fs.writeFile(packageDataPath,JSON.stringify(bookedpackage),error=>{
        console.log("File writing concluded", error);
      });
    });
   
  }

  static fetchAll(callback){
    const packageDataPath = path.join(rootDir,'data','package.json');
    fs.readFile(packageDataPath,(err,data)=>{
       console.log("file reading: " ,err, data);
      
      callback(!err? JSON.parse(data):[]);
    });
   
  }
}
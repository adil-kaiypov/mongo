var express = require('express');
var router = express.Router();
const fs = require("fs");

const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017"
const mongoClient = new MongoClient(url);

router.get("/toMongo", function(req, res){
  async function run(){
  try{
    await mongoClient.connect();
    const db = mongoClient.db("cars");
    const collection = db.collection("carInfo");
    const car = {autoName: req.query.autoName, year: req.query.year , price: req.query.price};
    const result = await collection.insertOne(car);
  }catch(e){
    console.log(e);
  }finally{
    await mongoClient.close();
  }
}
run().catch(console.error);

res.render('car.hbs', {});

});




router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/toTxt", function(req, res){
  fs.appendFileSync("car.txt", req.query.autoName + " " + req.query.year + " " + req.query.price + ',')
  res.render("car.hbs", {})
});

router.get("/listOfCars", function(req, res){
  let carList = fs.readFileSync("car.txt", 'utf8')
  res.render("carsList.hbs", {
    key1: carList
  })
});



module.exports = router;

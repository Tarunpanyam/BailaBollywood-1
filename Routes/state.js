const express = require('express');
const router = express.Router();
const cacheData = require('../middleware/cacheData');

router.get("/equipo",(req,res) => {
    res.render("../views/team.ejs");
  });
  
  router.get("/danzas-folkloricas-de-India", (req,res) => {
    res.render("../views/image-map-code.ejs");
  });
  
  router.get("/rajasthan", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/rajasthan.ejs")
  });
  router.get("/maharashtra", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/maharashtra.ejs")
  });
  
  router.get("/kashmir", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/kashmir.ejs")
  });
  
  router.get("/gujrat", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/gujrat.ejs")
  });
  router.get("/punjab", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/punjab.ejs")
  });
  router.get("/orrisa", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/orrisa.ejs")
  });

   router.get("/haryana", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/haryana.ejs")
  });
    router.get("/madhya-pradesh", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/madhya-pradesh.ejs")
  });
      router.get("/west-bengal", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/bengal.ejs")
  });
  
   router.get("/assam", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/assam.ejs")
  });
    router.get("/arunachal-pradesh", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/arunachal-pradesh.ejs")
  });
   router.get("/manipur", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/manipur.ejs")
  });
  router.get("/tamil-nadu", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/tamil-nadu.ejs")
  });
    router.get("/bihar", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/bihar.ejs")
  });

   router.get("/chhattisgarh", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/chhattisgarh.ejs")
  });
    router.get("/nagaland", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/nagaland.ejs")
  });
  router.get("/karnataka", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/karnataka.ejs")
  });
   router.get("/himachal-pradesh", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/himachal-pradesh.ejs")
  });
    router.get("/kerala", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/kerala.ejs")
  });
        router.get("/meghalaya", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/meghalaya.ejs")
  });
           router.get("/uttrakhand", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/uttrakhand.ejs")
  });
                router.get("/andhra-pradesh", cacheData.memoryCacheUse(36000),(req,res) => {
    res.render("../views/states/andhra-pradesh.ejs")
  });
     
       
      
  module.exports=router;
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
  
  
  module.exports=router;
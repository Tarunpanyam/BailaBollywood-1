const express = require('express');
const router = express.Router();
const BollywoodNews = require('../models/BollywoodNews');
const SubNews = require('../models/SubNews');
const cacheData = require('../middleware/cacheData');
const Comment = require('../models/Comment');


router.get('/bollywood-news/posts/:id/admin/comments',async(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/bollywoodNews/posts/'+id+'/admin/comments';
  let bnews = await BollywoodNews.findById(id).populate('comments');
  let comments = bnews.comments;
  console.log(bnews);
  console.log(comments);
  res.render("bnews/commentAdmin",{comments,requestUrl});
  
})
router.post('/bollywoo-nNews/:id/comments',async(req,res)=>{
  try {
    console.log("abc triggered");
  let id = req.params.id;
  
  let comment = await Comment.create(req.body.comment);
  comment.save();
  let bnews = await BollywoodNews.findById(id);
  bnews.comments.push(comment);
  bnews.save();
  res.redirect('/bollywoodNews/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
    
  }
  
})

router.delete('/bollyw-nodNews/comments/:cid/delete',async(req,res)=>{
  try {
    let id = req.params.cid;
  await Comment.findByIdAndRemove(id);
  res.redirect('back');
  } catch (error) {
    console.log(error);
  }
})

router.get('/bollywood-news',(req,res)=>{
  BollywoodNews.find({},(err,allBollywoodNews)=>{

    let requestUrl = '/bollywoodNews/index';
    res.render('../views/bnews/index',{allBollywoodNews,requestUrl});
  })
})


router.get('/bollywood-news/index',(req,res)=>{
  BollywoodNews.find({},(err,allBollywoodNews)=>{

    let requestUrl = '/bollywoodNews/index';
    res.render('bnews/indexSecond',{allBollywoodNews,requestUrl});
  })
})



router.get("/bollywood-news/posts/new",(req,res)=>{
    let requestUrl = '/bollywoodNews/posts/new';
    req.flash("success","Welcome");
    res.render("bnews/new.ejs",{requestUrl});
})





router.get('/bollywood-news/posts/:id',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/bollywoodNews/posts/'+id;
  BollywoodNews.findById(id).populate('subNews').populate('comments').exec(function(err,foundNews){
    if(err)
    console.log(err.message);
    let comments = foundNews.comments;
    console.log(comments);
    res.render('../views/bnews/show',{BollywoodNews:foundNews,comments,requestUrl});
  });
})

router.get("/bollywood-news/posts/:id/add-more-information",(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/bollywoodNews/posts/'+id+'/add-more-information';
  res.render("../views/bnews/addMoreInformation.ejs",{id,requestUrl});
})


router.get('/bollywood-news/posts/:id/edit',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/bollywoodNews/posts/'+id+'/edit';
  BollywoodNews.findById(id,function(err,foundNews){
    res.render("../views/bnews/bollywoodNewsEdit",{bnews:foundNews,requestUrl});
  })
})

router.get('/bollywood-news/posts/:id/admin',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/bollywoodNews/posts/'+id+'/admin';
  BollywoodNews.findById(id).populate('subNews').exec(function(err,foundNews){
    if(err)
    console.log(err.message);
    console.log(foundNews);
    res.render('../views/bnews/showAdmin',{BollywoodNews:foundNews,requestUrl});
  });
})
router.get('/bollywood-news/posts/:id/delete',(req,res)=>{
  let id=req.params.id;
  //let requestUrl = '/bollywoodNews/posts/'+id+'/delete';
  console.log(id);
  BollywoodNews.findById(id,function(err,foundNews){
    if(err)
    console.log(err.message);
    console.log(foundNews._id);
    foundNews.subNews.forEach(function(subint){
      console.log("Suinterviews:"+subint);
      SubNews.findByIdAndRemove(subint,function(err){
        if(err)
        console.log(err);
      })
    })
    foundNews.remove();
    res.redirect('/bollywoodNews');
  })
})

router.get('/bollywood-news/posts/:id/subNews/:sid/edit',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  let requestUrl = '/bollywoodNews/posts/'+id+'subNews/'+sid+'/edit';
  SubNews.findById(sid,(err,foundSubInterview)=>{
    if(err)
    console.log(err.message);
    res.render('../views/bnews/subInterviewEdit',{subInterview:foundSubInterview,id,sid});
  })
})

router.get('/bollywood-news/posts/:id/subNews/:sid/delete',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  SubNews.findByIdAndDelete(sid,(err)=>{
    if(err)
    console.log(err.message);
    res.redirect('back');
  })
})




router.post('/bollywoo-nNews/posts',(req,res)=>{
  BollywoodNews.create(req.body.bnews).then((err,newNews)=>{
    if(err)
    console.log(err.message);
    console.log("created");
    console.log(newNews);
    res.redirect('/bollywoodNews');
  }
  )
})

router.post('/bollywoo-nNews/posts/:id',(req,res)=>{
  let id = req.params.id;
  console.log(req.body.subInterview);
  
  SubNews.create(req.body.subInterview,(err,subNews)=>{
    if(err)
    console.log(err.message);
    console.log("created subNews");
    BollywoodNews.findById(id,(err,foundNews)=>{
      if(err)
      console.log(err.message);
      console.log("Pushed into bnews");
      foundNews.subNews.push(subNews);
      foundNews.save();
      res.redirect('/bollywoodNews/posts/'+id+'/admin');
    })
    
    //console.log(subNews.title +"\n"+subNews.image+"\n"+subNews.content );
  })
  

});




router.put('/bollywood-news/posts/:id/subNews/:sid',(req,res)=>{
  console.log("Put method triggered");
  let sid = req.params.sid;
  let id = req.params.id;
  SubNews.findByIdAndUpdate(sid,req.body.subInterview,function(err,newSubInterview){
    if(err)
    console.log(err.message);
    console.log("SubNews Updated");
    res.redirect('/bollywoodNews/posts/'+id+'/admin');
  })
})

router.put('/bollywood-news/posts/:id',(req,res)=>{
  console.log("Put method triggered");
  let id = req.params.id;
  BollywoodNews.findByIdAndUpdate(id,req.body.bnews,function(err,foundNews){
    if(err)
    console.log(err.message);
    console.log("BollywoodNews Updated");
    res.redirect('/bollywoodNews/posts/'+id+'/admin');
  })
})
 
  
  module.exports=router;
const express = require('express');
const router = express.Router();
const BollywoodNews = require('../models/BollywoodNews');
const SubNews = require('../models/SubNews');
const cacheData = require('../middleware/cacheData');
const Comment = require('../models/Comment');



router.get('/all',async(req,res)=>{
  try {
   var allNews = await BollywoodNews.find({});
   var length = allNews.length;
   allNews.forEach(news=>{
     news.index = length;
     length--;
     news.save();
   })
   allNews.forEach(news=>{
    console.log(news.index);
   })
   
  const bnews = await BollywoodNews.find({}).limit(10);
   res.render('bnews/all',{bnews});
  } catch (error) {
  console.log(error.message);  
  }
})

router.get('/posts/:id/admin/comments',async(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/canal-bollywood/posts/'+id+'/admin/comments';
  let bnews = await BollywoodNews.findById(id).populate('comments');
  let comments = bnews.comments;
  console.log(bnews);
  console.log(comments);
  res.render("bnews/commentAdmin",{comments,requestUrl});
  
})
router.post('/:id/comments',async(req,res)=>{
  try {
    console.log("abc triggered");
  let id = req.params.id;
  
  let comment = await Comment.create(req.body.comment);
  comment.save();
  let bnews = await BollywoodNews.findById(id);
  bnews.comments.push(comment);
  bnews.save();
  res.redirect('/canal-bollywood/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
    
  }
  
})

router.delete('/comments/:cid/delete',async(req,res)=>{
  try {
    let id = req.params.cid;
  await Comment.findByIdAndRemove(id);
  res.redirect('back');
  } catch (error) {
    console.log(error);
  }
})

router.get('',(req,res)=>{
  BollywoodNews.find({},(err,allBollywoodNews)=>{

    let requestUrl = '/canal-bollywood/index';
    res.render('../views/bnews/index',{allBollywoodNews,requestUrl});
  })
})


router.get('/index',(req,res)=>{
  BollywoodNews.find({},(err,allBollywoodNews)=>{

    let requestUrl = '/canal-bollywood/index';
    res.render('bnews/indexSecond',{allBollywoodNews,requestUrl});
  })
})



router.get("/posts/new",(req,res)=>{
    let requestUrl = '/canal-bollywood/posts/new';
    req.flash("success","Welcome");
    res.render("bnews/new.ejs",{requestUrl});
})





router.get('/posts/:id',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/canal-bollywood/posts/'+id;
  BollywoodNews.findById(id).populate('subNews').populate('comments').exec(function(err,foundNews){
    if(err)
    console.log(err.message);
    let comments = foundNews.comments;
    console.log(foundNews.category);
    res.render('../views/bnews/show',{BollywoodNews:foundNews,comments,requestUrl});
  });
})

router.get("/posts/:id/add-more-information",(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/canal-bollywood/posts/'+id+'/add-more-information';
  res.render("../views/bnews/addMoreInformation.ejs",{id,requestUrl});
})


router.get('/posts/:id/edit',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/canal-bollywood/posts/'+id+'/edit';
  BollywoodNews.findById(id,function(err,foundNews){
    res.render("../views/bnews/bollywoodNewsEdit",{bnews:foundNews,requestUrl});
  })
})

router.get('/posts/:id/admin',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/canal-bollywood/posts/'+id+'/admin';
  BollywoodNews.findById(id).populate('subNews').exec(function(err,foundNews){
    if(err)
    console.log(err.message);
    console.log(foundNews);
    res.render('../views/bnews/showAdmin',{BollywoodNews:foundNews,requestUrl});
  });
})
router.get('/posts/:id/delete',(req,res)=>{
  let id=req.params.id;
  //let requestUrl = '/canal-bollywood/posts/'+id+'/delete';
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
    res.redirect('/canal-bollywood');
  })
})

router.get('/posts/:id/subNews/:sid/edit',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  let requestUrl = '/canal-bollywood/posts/'+id+'subNews/'+sid+'/edit';
  SubNews.findById(sid,(err,foundSubInterview)=>{
    if(err)
    console.log(err.message);
    res.render('../views/bnews/subInterviewEdit',{subInterview:foundSubInterview,id,sid});
  })
})

router.get('/posts/:id/subNews/:sid/delete',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  SubNews.findByIdAndDelete(sid,(err)=>{
    if(err)
    console.log(err.message);
    res.redirect('back');
  })
})




router.post('/posts',async(req,res)=>{
  try {
    console.log('-----------------------------')
    console.log(req.body.bnews);
    console.log('-----------------------------')
    let newNews = await BollywoodNews.create(req.body.bnews);
    let savedNews = await newNews.save();
    console.log(savedNews);
    res.redirect('/canal-bollywood/all');
  } catch (error) {
    console.log(error);
    
  }
  
  
})

router.post('/posts/:id',(req,res)=>{
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
      res.redirect('/canal-bollywood/posts/'+id+'/admin');
    })
    
    //console.log(subNews.title +"\n"+subNews.image+"\n"+subNews.content );
  })
  

});




router.put('/posts/:id/subNews/:sid',(req,res)=>{
  console.log("Put method triggered");
  let sid = req.params.sid;
  let id = req.params.id;
  SubNews.findByIdAndUpdate(sid,req.body.subInterview,function(err,newSubInterview){
    if(err)
    console.log(err.message);
    console.log("SubNews Updated");
    res.redirect('/canal-bollywood/posts/'+id+'/admin');
  })
})

router.put('/posts/:id',(req,res)=>{
  console.log("Put method triggered");
  let id = req.params.id;
  BollywoodNews.findByIdAndUpdate(id,req.body.bnews,function(err,foundNews){
    if(err)
    console.log(err.message);
    console.log("BollywoodNews Updated");
    res.redirect('/canal-bollywood/posts/'+id+'/admin');
  })
})

 
  
  module.exports=router;
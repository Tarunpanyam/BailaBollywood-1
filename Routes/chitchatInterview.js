const express = require('express');
const router = express.Router();
const chitChatInterview = require('../models/ChitChatInterview');
const SubInterview = require('../models/SubInterview');
const cacheData = require('../middleware/cacheData');
const Comment = require('../models/Comment');


router.get('/chitChatInterviews/posts/:id/admin/comments',async(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chitChatInterviews/posts/'+id+'/adming/comments';
  let interview = await chitChatInterview.findById(id).populate('comments');
  let comments = interview.comments;
  console.log(interview);
  console.log(comments);
  res.render("chitChatInterview/commentAdmin",{comments,requestUrl});
  
})
router.post('/chitChatInterviews/:id/comments',async(req,res)=>{
  try {
    console.log("abc triggered");
  let id = req.params.id;
  //let requestUrl = '/chitChatInterviews/'+id+'/comments';
  console.log(req.body.comment);
  let comment = await Comment.create(req.body.comment);
  comment.save();
  let interview = await chitChatInterview.findById(id);
  interview.comments.push(comment);
  interview.save();
  res.redirect('/chitChatInterviews/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
    
  }
  
})

router.delete('/chitChatInterviews/comments/:cid/delete',async(req,res)=>{
  try {
    let id = req.params.cid;
  await Comment.findByIdAndRemove(id);
  res.redirect('back');
  } catch (error) {
    console.log(error);
  }
})

router.get('/chitChatInterviews/index',async(req,res)=>{
    try {
        let interviews = await chitChatInterview.find({});
        console.log(interviews);
        let requestUrl = '/chitChatInterviews/index';
        res.render('../views/chitChatInterview/indexSecond',{interviews,requestUrl});
        
        
    } catch (error) {

        console.log(error.message);
        
    }
})

  
router.get("/chitChatInterviews/",async(req,res) => {
  try{
    let allInterviews = await chitChatInterview.find({});
    let requestUrl = '/chitChatInterviews/';
    let fourInt=[];
    let count=0;
    let id;
    let twoQ=[];
    //console.log('all')
    allInterviews.forEach(interview=>{
      count++;
      if(count===1)
      {
        id = interview._id;
      }

      if(count<=4){
      let image = interview.image;
      let title = interview.title;
      let url = '/chitChatInterviews/posts/'+interview._id;
      let obj = {image:image,title:title,url:url};
      fourInt.push(obj);
    }
     

    });
    let pinterview = await chitChatInterview.findById(id).populate('subInterviews');
    count=0;
    //console.log(pinterview);
      pinterview.subInterviews.forEach(sub=>{
        count++;
        if(count<=2)
        {
          let title = sub.title;
          let content = sub.content;
          
          let objj = {title:title,content:content};
          twoQ.push(objj);
        }
        
      })
      //console.log(twoQ[0]);
      //----------------------
      let chitChatInterviews = await chitChatInterview.find({}).sort({created:-1});
    let length = chitChatInterviews.length;
    let latestInterviews=[];
    let c=0;
    let check=0;
    chitChatInterviews.forEach(interview=>{
      c++;
      if(c<=9){
      
        let title = interview.title;
        let thumbnail = interview.thumbnail;
        let index = c%3;
        let url = "/chitChatInterviews/posts/"+interview._id;
        if(index===0)
        index=3;
        let obj = {title:title,thumbnail:thumbnail,index:index,check:check,url:url};
        latestInterviews.push(obj);
      }
      
      });
      //---------------------
      //console.log(latestInterviews);
      console.log(twoQ);
      res.render('../views/chitChatInterview/index',{fourInt,twoQ,latestInterviews,requestUrl});


  }
  catch(error){

    console.log(error.message);
  }
  
    
  });

router.get("/chitChatInterviews/posts/new",(req,res)=>{
    let requestUrl = '/chitChatInterviews/posts/new';
    req.flash("success","Welcome");
    res.render("../views/chitChatInterview/new.ejs",{requestUrl});
})





router.get('/chitChatInterviews/posts/:id',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chitChatInterviews/posts/'+id;
  chitChatInterview.findById(id).populate('subInterviews').populate('comments').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    let comments = foundInterview.comments;
    console.log(comments);
    res.render('../views/chitChatInterview/show',{Interview:foundInterview,comments,requestUrl});
  });
})

router.get("/chitChatInterviews/posts/:id/add-more-information",(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chitChatInterviews/posts/'+id+'/add-more-information';
  res.render("../views/chitChatInterview/addMoreInformation.ejs",{id,requestUrl});
})


router.get('/chitChatInterviews/posts/:id/edit',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chitChatInterviews/posts/'+id+'/edit';
  chitChatInterview.findById(id,function(err,foundInterview){
    res.render("../views/chitChatInterview/interviewEdit",{interview:foundInterview,requestUrl});
  })
})

router.get('/chitChatInterviews/posts/:id/admin',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/chitChatInterviews/posts/'+id+'/admin';
  chitChatInterview.findById(id).populate('subInterviews').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log(foundInterview);
    res.render('../views/chitChatInterview/showAdmin',{Interview:foundInterview,requestUrl});
  });
})
router.get('/chitChatInterviews/posts/:id/delete',(req,res)=>{
  let id=req.params.id;
  //let requestUrl = '/chitChatInterviews/posts/'+id+'/delete';
  console.log(id);
  chitChatInterview.findById(id,function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log(foundInterview._id);
    foundInterview.subInterviews.forEach(function(subint){
      console.log("Suinterviews:"+subint);
      SubInterview.findByIdAndRemove(subint,function(err){
        if(err)
        console.log(err);
      })
    })
    foundInterview.remove();
    res.redirect('/chitChatInterviews');
  })
})
router.get("/chitChatInterviews/posts/:id/form1",(req,res)=>{
  let id = req.params.id;
  let requestUrl = 'chitChatInterviews/posts/'+id+'/form1';
  res.render("../views/chitChatInterview/form1",{id,requestUrl});
})

router.get("/chitChatInterviews/posts/:id/form2",(req,res)=>{
  let id = req.params.id;
  let requestUrl = 'chitChatInterviews/posts/'+id+'/form2';
  res.render("../views/chitChatInterview/form2",{id,requestUrl});
})

router.get("/chitChatInterviews/posts/:id/form3",(req,res)=>{
  let id = req.params.id;
  let requestUrl = 'chitChatInterviews/posts/'+id+'/form3';
  res.render("../views/chitChatInterview/form3",{id,requestUrl});
})

router.get('/chitChatInterviews/posts/:id/subInterviews/:sid/edit',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  let requestUrl = '/chitChatInterviews/posts/'+id+'subInterviews/'+sid+'/edit';
  SubInterview.findById(sid,(err,foundSubInterview)=>{
    if(err)
    console.log(err.message);
    res.render('../views/chitChatInterview/subInterviewEdit',{subInterview:foundSubInterview,id,sid});
  })
})

router.get('/chitChatInterviews/posts/:id/subInterviews/:sid/delete',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  SubInterview.findByIdAndDelete(sid,(err)=>{
    if(err)
    console.log(err.message);
    res.redirect('back');
  })
})




router.post('/chitChatInterviews/posts',(req,res)=>{
  chitChatInterview.create(req.body.interview).then((err,newInterview)=>{
    if(err)
    console.log(err.message);
    console.log("created");
    console.log(newInterview);
    res.redirect('/chitChatInterviews');
  }
  )
})

router.post('/chitChatInterviews/posts/:id',(req,res)=>{
  let id = req.params.id;
  console.log(req.body.subInterview);
  
  SubInterview.create(req.body.subInterview,(err,subinterview)=>{
    if(err)
    console.log(err.message);
    console.log("created subinterview");
    chitChatInterview.findById(id,(err,foundInterview)=>{
      if(err)
      console.log(err.message);
      console.log("Pushed into interview");
      foundInterview.subInterviews.push(subinterview);
      foundInterview.save();
      res.redirect('/chitChatInterviews/posts/'+id+'/admin');
    })
    
    //console.log(subinterview.title +"\n"+subinterview.image+"\n"+subinterview.content );
  })
  

});




router.put('/chitChatInterviews/posts/:id/subInterviews/:sid',(req,res)=>{
  console.log("Put method triggered");
  let sid = req.params.sid;
  let id = req.params.id;
  SubInterview.findByIdAndUpdate(sid,req.body.subInterview,function(err,newSubInterview){
    if(err)
    console.log(err.message);
    console.log("SubInterview Updated");
    res.redirect('/chitChatInterviews/posts/'+id+'/admin');
  })
})

router.put('/chitChatInterviews/posts/:id',(req,res)=>{
  console.log("Put method triggered");
  let id = req.params.id;
  chitChatInterview.findByIdAndUpdate(id,req.body.interview,function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log("chitChatInterview Updated");
    res.redirect('/chitChatInterviews/posts/'+id+'/admin');
  })
})
 
  
  module.exports=router;
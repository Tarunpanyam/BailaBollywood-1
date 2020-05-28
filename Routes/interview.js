const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const SubInterview = require('../models/SubInterview');
const cacheData = require('../middleware/cacheData');
const Comment = require('../models/Comment');


router.get('/interviews/posts/:id/admin/comments',async(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/interviews/posts/'+id+'/admin/comments';
  let interview = await Interview.findById(id).populate('comments');
  let comments = interview.comments;
  console.log(interview);
  console.log(comments);
  res.render("interview/commentAdmin",{comments,requestUrl});
  
})
router.post('/interviews/:id/comments',async(req,res)=>{
  try {
    console.log("abc triggered");
  let id = req.params.id;
  //let requestUrl = '/interviews/'+id+'/comments';
  console.log(req.body.comment);
  let comment = await Comment.create(req.body.comment);
  comment.save();
  let interview = await Interview.findById(id);
  interview.comments.push(comment);
  interview.save();
  res.redirect('/interviews/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
    
  }
  
})

router.delete('/interviews/comments/:cid/delete',async(req,res)=>{
  try {
    let id = req.params.cid;
  await Comment.findByIdAndRemove(id);
  res.redirect('back');
  } catch (error) {
    console.log(error);
  }
})

router.get('/interviews/index',(req,res)=>{
  Interview.find({},(err,Interviews)=>{

    let requestUrl = '/interviews/index';
    res.render('../views/interview/index',{Interviews,requestUrl});
  })
})

  
router.get("/interviews/",async(req,res) => {
  try{
    let allInterviews = await Interview.find({});
    let requestUrl = '/interviews/';
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
      let url = '/interviews/posts/'+interview._id;
      let obj = {image:image,title:title,url:url};
      fourInt.push(obj);
    }
     

    });
    let pinterview = await Interview.findById(id).populate('subInterviews');
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
      let interviews = await Interview.find({}).sort({created:-1});
    let length = interviews.length;
    let latestInterviews=[];
    let c=0;
    let check=0;
    interviews.forEach(interview=>{
      c++;
      if(c<=9){
      
        let title = interview.title;
        let thumbnail = interview.thumbnail;
        let index = c%3;
        let url = "/interviews/posts/"+interview._id;
        if(index===0)
        index=3;
        let obj = {title:title,thumbnail:thumbnail,index:index,check:check,url:url};
        latestInterviews.push(obj);
      }
      
      });
      //---------------------
      console.log(latestInterviews);

      res.render('../views/interview/index',{fourInt,twoQ,latestInterviews,requestUrl});


  }
  catch(error){

    console.log(error.message);
  }
  
    
  });

router.get("/interviews/posts/new",(req,res)=>{
    let requestUrl = '/interviews/posts/new';
    req.flash("success","Welcome");
    res.render("../views/interview/new.ejs",{requestUrl});
})





router.get('/interviews/posts/:id',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/interviews/posts/'+id;
  Interview.findById(id).populate('subInterviews').populate('comments').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    let comments = foundInterview.comments;
    console.log(comments);
    res.render('../views/interview/show',{Interview:foundInterview,comments,requestUrl});
  });
})

router.get("/interviews/posts/:id/add-more-information",(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/interviews/posts/'+id+'/add-more-information';
  res.render("../views/interview/addMoreInformation.ejs",{id,requestUrl});
})


router.get('/interviews/posts/:id/edit',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/interviews/posts/'+id+'/edit';
  Interview.findById(id,function(err,foundInterview){
    res.render("../views/interview/interviewEdit",{interview:foundInterview,requestUrl});
  })
})

router.get('/interviews/posts/:id/admin',(req,res)=>{
  let id = req.params.id;
  let requestUrl = '/interviews/posts/'+id+'/admin';
  Interview.findById(id).populate('subInterviews').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log(foundInterview);
    res.render('../views/interview/showAdmin',{Interview:foundInterview,requestUrl});
  });
})
router.get('/interviews/posts/:id/delete',(req,res)=>{
  let id=req.params.id;
  //let requestUrl = '/interviews/posts/'+id+'/delete';
  console.log(id);
  Interview.findById(id,function(err,foundInterview){
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
    res.redirect('/interviews');
  })
})


router.get('/interviews/posts/:id/subInterviews/:sid/edit',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  let requestUrl = '/interviews/posts/'+id+'subInterviews/'+sid+'/edit';
  SubInterview.findById(sid,(err,foundSubInterview)=>{
    if(err)
    console.log(err.message);
    res.render('../views/interview/subInterviewEdit',{subInterview:foundSubInterview,id,sid});
  })
})

router.get('/interviews/posts/:id/subInterviews/:sid/delete',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
  SubInterview.findByIdAndDelete(sid,(err)=>{
    if(err)
    console.log(err.message);
    res.redirect('back');
  })
})




router.post('/interviews/posts',(req,res)=>{
  Interview.create(req.body.interview).then((err,newInterview)=>{
    if(err)
    console.log(err.message);
    console.log("created");
    console.log(newInterview);
    res.redirect('/interviews');
  }
  )
})

router.post('/interviews/posts/:id',(req,res)=>{
  let id = req.params.id;
  console.log(req.body.subInterview);
  
  SubInterview.create(req.body.subInterview,(err,subinterview)=>{
    if(err)
    console.log(err.message);
    console.log("created subinterview");
    Interview.findById(id,(err,foundInterview)=>{
      if(err)
      console.log(err.message);
      console.log("Pushed into interview");
      foundInterview.subInterviews.push(subinterview);
      foundInterview.save();
      res.redirect('/interviews/posts/'+id+'/admin');
    })
    
    //console.log(subinterview.title +"\n"+subinterview.image+"\n"+subinterview.content );
  })
  

});




router.put('/interviews/posts/:id/subInterviews/:sid',(req,res)=>{
  console.log("Put method triggered");
  let sid = req.params.sid;
  let id = req.params.id;
  SubInterview.findByIdAndUpdate(sid,req.body.subInterview,function(err,newSubInterview){
    if(err)
    console.log(err.message);
    console.log("SubInterview Updated");
    res.redirect('/interviews/posts/'+id+'/admin');
  })
})

router.put('/interviews/posts/:id',(req,res)=>{
  console.log("Put method triggered");
  let id = req.params.id;
  Interview.findByIdAndUpdate(id,req.body.interview,function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log("Interview Updated");
    res.redirect('/interviews/posts/'+id+'/admin');
  })
})
 
  
  module.exports=router;
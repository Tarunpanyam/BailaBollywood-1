const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const SubInterview = require('../models/SubInterview');
const cacheData = require('../middleware/cacheData');


router.get('/interviews/index',(req,res)=>{
  Interview.find({},(err,Interviews)=>{
    res.render('../views/interview/index',{Interviews});
  })
})



router.get("/interviews/interview1",(req,res) => {
    
    res.render("../views/interview/interview1.ejs");
  });

  
router.get("/interviews/",(req,res) => {
  Interview.find({},(err,allInterviews)=>{
    if(err)
    console.log(err);
    let fourInt=[];
    let count=0;
    let id;
    let twoQ=[];
    console.log('all')
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
    Interview.findById(id).populate('subInterviews').exec(function(err,pinterview){
      count=0;
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
      console.log(twoQ[0]);
      res.render('../views/interview/indexSecond',{fourInt,twoQ});
    })

  })
  });

router.get("/interviews/posts/new",(req,res)=>{
    req.flash("success","Welcome");
    res.render("../views/interview/new.ejs");
})





router.get('/interviews/posts/:id',(req,res)=>{
  let id = req.params.id;
  Interview.findById(id).populate('subInterviews').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    res.render('../views/interview/show',{Interview:foundInterview});
  });
})

router.get("/interviews/posts/:id/add-more-information",(req,res)=>{
  let id = req.params.id;
  res.render("../views/interview/addMoreInformation.ejs",{id});
})


router.get('/interviews/posts/:id/edit',(req,res)=>{
  let id = req.params.id;
  Interview.findById(id,function(err,foundInterview){
    res.render("../views/interview/interviewEdit",{interview:foundInterview});
  })
})

router.get('/interviews/posts/:id/admin',(req,res)=>{
  let id = req.params.id;
  Interview.findById(id).populate('subInterviews').exec(function(err,foundInterview){
    if(err)
    console.log(err.message);
    console.log(foundInterview);
    res.render('../views/interview/adminShow',{Interview:foundInterview});
  });
})
router.get('/interviews/posts/:id/delete',(req,res)=>{
  let id=req.params.id;
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
router.get("/interviews/posts/:id/form1",(req,res)=>{
  let id = req.params.id;
  res.render("../views/interview/form1",{id});
})

router.get("/interviews/posts/:id/form2",(req,res)=>{
  let id = req.params.id;
  res.render("../views/interview/form2",{id});
})

router.get("/interviews/posts/:id/form3",(req,res)=>{
  let id = req.params.id;
  res.render("../views/interview/form3",{id});
})

router.get('/interviews/posts/:id/subInterviews/:sid/edit',(req,res)=>{
  let sid = req.params.sid;
  let id = req.params.id;
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
  

})


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
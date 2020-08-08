const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const fs = require('fs');
const path = require('path');
const Comment = require('../models/Comment');
const middleware = require('../middleware');
const cacheData = require('../middleware/cacheData');
const SubPlace = require('../models/SubPlace');


router.get('/posts/new',async(req,res)=>{
  try{
    res.render('places/new');

  }
  catch(err){
    console.log(err.message);
  }
})
router.put('/posts/:id/subPlaces/:sid',async(req,res)=>{
  try {
    let sid = req.params.sid;
    let subPlace = await SubPlace.findById(sid);
    subPlace.image = req.body.subPlace.image;
    subPlace.title = req.body.subPlace.title;
    if(req.body.subPlace.content!="")
    {
      subPlace.content = req.body.subPlace.content;
    }
    let savedSubPlace =await subPlace.save();
    res.redirect('/places/posts'+req.params.id);
  } catch (error) {
    console.log(error.message);
  }
})



// subPlaces route
router.get('/posts/:id/subPlaces/:sid/edit',async(req,res)=>{
  try {
    console.log("-------triigered---------");
    let sid = req.params.sid;
    let id = req.params.id;
    let subPlace = await SubPlace.findById(sid);
    
    res.render('../views/places/subPlaceEdit',{subPlace,id});
  } catch (error) {
    console.log(error.message);
  }
})

router.get('/posts/:id/subPlaces/:sid/delete',async(req,res)=>{
  try {
    let sid = req.params.sid;
    await SubPlace.findByIdAndRemove(sid);
    res.redirect('back');
    
  } catch (error) {
    console.log(error.message);
    
  }
})

// everything will start from /places

// url:/places
//  INdex page route
router.get('/', async(req, res) => {
  try {
    let requestUrl = '/places/';
    let latestPlaces = [];
    let topPlaces = [];
    let i=0;
    let placez = await Place.find({});
    placez.forEach(blg=>{
      i++;
      if(i<=4)
      topPlaces.push(blg);
    })
    let places = await Place.find({}).sort({created:-1});
    let length = places.length;
    
    let c=0;
    let check=0;
    places.forEach(place=>{
      c++;
      if(c<=9){
      if(place.image==="")
        check=1;
        else{
          check=0;
        }
        let title = place.title;
        let thumbnail = place.thumbnail;
        let tag = place.tag;
        let index = c%3;
        let url = "/places/posts/"+place._id;
        if(index===0)
        index=3;
        let obj = {title:title,thumbnail:thumbnail,tag:tag,index:index,check:check,url:url};
        latestPlaces.push(obj);
      }
      
      });
        
      res.render('../views/places/index',{places:topPlaces,latestPlaces,requestUrl});


    
    
  } catch (error) {
    console.log(err.message);
    
  }
    
    
  })

  router.get('/check',async(req,res)=>{
    try {
      const places = await Place.find({}).sort({created:-1}).limit(4);
      res.render('places/check',{places})
    } catch (error) {
      console.log(error.message);
    }
  })


  router.get('/placeGet',async(req,res)=>{
    try{

      var page = 1;
  const limit = 4;
      
  const count = await Place.countDocuments();
  const totalPages = Math.ceil(count/limit);
  if(req.query.page!=null)
  page = req.query.page;
  console.log(page);
  if(page<=0)
  page=1;
  if(page>totalPages)
  page=totalPages;
  
  const places = await Place.find().limit(limit*1).skip((page-1)*limit).sort({created:-1}).exec();
    res.send(places);

    }
    catch(err){
      console.log(err.message);
    }
  })


  // All Places Combined
router.get("/AllPlaces",async (req,res)=>{
  var page = 1;
  const limit = 4;
  try{
    /*
  const count = await Place.countDocuments();
  const totalPages = Math.ceil(count/limit);
  if(req.query.page!=null)
  page = req.query.page;
  console.log(page);
  if(page<=0)
  page=1;
  if(page>totalPages)
  page=totalPages;
  
  const places = await Place.find().limit(limit*1).skip((page-1)*limit).sort({created:-1}).exec();
  */
 const places = await Place.find({}).sort({created:-1});
 let c=0;
 let len = places.length;
 places.forEach(place=>{
   c++;
   place.number = c;
   
   place.save();
    })
  res.render('../views/places/all',{places});
}
catch(err){
  console.log(err.message);
}
})

  
  //url:/places/:id
  // getting individual Post
  router.get('/posts/:id', async (req, res) => { 
    try {
      var places = await Place.find({});
      var totalNumber = await places.length;
      
      let id = req.params.id;
      let requestUrl = '/places/post/'+id;
      let place = await Place.findById(id).populate('subPlaces').populate('comments');
      console.log(place);
      var subPlacez=place.subPlaces;
      console.log("----------------------");
      console.log(place);
      console.log("----------------------");
      var commentz = place.comments;
      
      let a = place.number+1;
      let b = place.number-1;
      let next , prev ,nextId ,prevId;
      next = null;
      prev = null;
      nextId=0;
      prevId=0;
      
      if(place.number===1){
        next = await Place.find({number:a});
        if(next!=null)
        nextId = next[0]._id;
        
      }
      else if(place.number===totalNumber){
        prev = await Place.find({number:b});
        if(prev!=null)
        prevId = prev[0]._id;
      }

      
      else{
      next = await Place.find({number:a});
      prev = await Place.find({number:b});
      if(next!=null && next[0]._id!=null)
      nextId = next[0]._id;
      if(prev!=null && prev[0]._id!=null)
      prevId = prev[0]._id;
      }
      
      
      const tagg = place.tag;
      
      let currNumber = place.number;
      let placez = await Place.find({tag:tagg});
      let numberArray=[];
      let count=0;
      placez.forEach(blg=>{
        if(blg.number!=currNumber)
        {numberArray.push(blg.number);
        count++;}
      })
      let randomNumber = Math.floor(Math.random()*count);
      
      var suggestedNumber = numberArray[randomNumber];
      let suggestionPlace = await Place.find({number:suggestedNumber});
      
      if(suggestionPlace.length===0){
        suggestionPlace=next;
      }
      //console.log(next);
      //console.log(prev);
      res.render('../views/places/show', {place,subPlacez,commentz,next,prevId,nextId,prev,suggestionPlace,requestUrl});
      
    } catch (error) {
      console.log(error.message);
      console.log(error);
      
    }
  });
  router.get('/posts/:id/edit',async(req,res)=>{
    try {
      let id = req.params.id;
      let place = await Place.findById(id);
      res.render('../views/places/edit',{place});
  
      
    } catch (error) {
      console.log(error.message);
      
    }

  })
    

    



  // Only Admin can see the comments
  router.get('/posts/:id/admin',(req,res)=>{
    let id = req.params.id;
    
    Place.findById(id).populate("subPlaces").populate("comments").exec(function(err,place){
      if(err)
      console.log(err);
      //console.log(place.subPlaces[0].image);
      console.log("----!"+place.image+"!------");
      var subPlacez=place.subPlaces;
      //subPlacez.forEach(function(subPlace){
      //  console.log(subPlace.image);
      //})
      res.render('../views/places/adminShow', {place,subPlacez});
    });
  })

  // deleting comments
  // Only Adming can delete comment
router.delete("/posts/:id/comments/:cid",(req,res)=>{
  
  let cid = req.params.cid;
  Comment.findByIdAndRemove(cid).then(err=>{
    
      res.redirect("back");
    
  }).catch(err=>{
    res.redirect('back');
  })
});

  //url:/places/new
  // Adding New Place
  // Only Admin can Add new Place
router.post('/posts/new', async(req, res) => {
  try {
    if (req.files) {
      let file = req.files.image;
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          //console.log(req.body.content);
          let sanitizedContent = req.sanitize(req.body.content);
          //console.log(sanitizedContent);
          console.log(req.body.tag+"-------------");
          let places = await Place.find({});
          let totalNumber = places.length+1;
          let place = new Place({ 
            title: req.body.title ,
            tag:req.body.tag,
            tag1:req.body.tag1,
            tag2:req.body.tag2,
            tag3:req.body.tag3,
            tag4:req.body.tag4,
            number:totalNumber,
            image: req.files.image.name,
            thumbnail:req.files.image.name, 
            content: sanitizedContent, 
            creator: req.body.name })

          file.mv(`./public/uploads/${file.name}`, err => console.log(err ? 'Error on save the image!' : 'Image Uploaded!'));
          
          const savedPlace = await place.save();
          console.log(savedPlace);
          console.log('Place Saved!');
          res.redirect('/places/allPlaces');
        
           
      } // Finish mimetype statement
  } else {
    console.log('You must Upload a image-post!');
    let sanitizedContent = req.sanitize(req.body.content);
          //console.log(sanitizedContent);
          console.log(req.body.tag+"-------------");
          let place = new Place({ title: req.body.title ,
            tag:req.body.tag,
            tag1:req.body.tag1,
            tag2:req.body.tag2,
            tag3:req.body.tag3,
            tag4:req.body.tag4,
            image:"",
            thumbnail:"", 
            content: sanitizedContent, 
            creator: req.body.name })
          //file.mv(`./public/uploads/${file.name}`, err => console.log(err ? 'Error on save the image!' : 'Image Uploaded!'));
          await place.save();
          console.log('Place Saved!');
            res.redirect('/places/allPlaces');
          }
         

    
  } catch (error) {
    console.log(error.message);
    
  }
});



router.get('/:id/subPlaces/new',(req,res)=>{
  var id = req.params.id;
  res.render('../views/places/add-more-information',{id});
  
})



// deleting Place ---only Admin can delete it
router.get('/posts/:id/delete',async (req,res)=>{
  console.log("Delete Method Triggered");
  let id = req.params.id;
  Place.findById(id).then(place=>{
    let toDel = path.join(__dirname,'../public/uploads/',place.image);
    
    fs.unlinkSync(toDel);
    place.subPlaces.remove({},err=>{
      if(err)
      console.log(err.message);
      console.log("SubPlaces Deleted");
    });
  });
  try {
  await Place.findByIdAndRemove(id);
  
    console.log("item deleted");
    res.redirect('/places/allPlaces');
  } catch (err) {
    console.log(err);
    res.sendStatus(404).render('error-page');
  }
})






router.get('/posts/:id/admin/comments',(req,res)=>{
  let id = req.params.id;
  Place.findById(id).populate('comments').exec(function(err,place){
    if(err)
    console.log(err.message);
    let comments = place.comments;
    res.render('../views/places/commentAdmin',{comments});
  })
}) 

router.get('/posts/:id/subPlaces/:sid/edit',async(req,res)=>{

})

// Post route for adding new comment on individual Place
// url:/places/posts/:id
router.post('/posts/:id',(req,res)=>{
  let id = req.params.id;

  console.log(req.body.comment);
  
  Comment.create(req.body.comment,function(err,comment){
    if(err)
    console.log(err.message);
    console.log('Created Comment');
    //res.redirect('/places/posts/'+id);
    comment.save();
    Place.findById(id , function(err , place){
      if(err)
      console.log(err.message);
      place.comments.push(comment);
      console.log('pushed');
      console.log(id);
      place.save();
    
    })
  
    res.redirect('/places/posts/'+id);
  })
  
  
})


router.post('/:id/subPlaces/new',async(req,res)=>{
  try {
  
  let subPlace = new SubPlace({title:req.body.title,content:req.body.content,image:req.body.image});
  let img = req.body.image;
  await subPlace.save();
  console.log(subPlace);
  console.log("----------succesfully created");
  let place = await Place.findById(req.params.id);
  if(place.thumbnail==="")
  {
    place.thumbnail=subPlace.image;
  }
  place.subPlaces.push(subPlace);
  await place.save();
  res.redirect('/places/posts/'+place._id+"/admin");
    
  } catch (err) {
    console.log(err.message);
    
  }
})
router.delete('/posts/comments/:cid',(req,res)=>{
  console.log("Delete Triggerd");
  Comment.findByIdAndRemove(req.params.cid,function(err){
    if(err)
    console.log(err.message);
    console.log('Comment Deleted');
    res.redirect('back');

  })
})

router.put('/posts/:id',async(req,res)=>{
  try {
    let id = req.params.id;
    let place = await Place.findById(id);
    console.log(place.tag);
    if(req.body.content!="")
    {
      place.content = req.body.content;
    }
    place.title = req.body.title;
    place.tag = req.body.tag;
    
    place.tag1 = req.body.tag1;
    
    place.tag2 = req.body.tag2;
    
    place.tag3 = req.body.tag3;
    
    place.tag4 = req.body.tag4;
    console.log(req.body.tag);
    console.log("-----"+req.body.tag2);
    console.log(req.body.tag4);
    place.save();
    res.redirect('/places/posts/'+id);
    
  } catch (error) {
    console.log(error.message);
    
  }
  
  
})


module.exports = router;
const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const SubPlace =require('../models/SubPlace');
const Comment = require('../models/Comment');

router.get('/', async(req,res)=>{
try {
    let Allplaces = await Place.find({});
    let places=[];
    let i=0;
    Allplaces.forEach(data=>{
        i++;
        if(i%2===1)
        var obj={title:data.title,thumbnail:data.thumbnail,colIndex:1,id:data._id};
        else
        var obj={title:data.title,thumbnail:data.thumbnail,colIndex:0,id:data._id};
        
        places.push(obj);
    })
    console.log(places);
    res.render('places/index',{places});

    
} catch (error) {
    console.log(error.message);
    
}
})

//-----------------get route for subplace form-------------------//
router.get('/posts/:id/add-more-information',async(req,res)=>{
    try {
        let id = req.params.id;
        res.render('places/addMorInformation',{id});
        
    } catch (error) {
        console.log(error.message);
    }
})

router.post('/posts/:id',async(req,res)=>{
    try {
        let id = req.params.id
        console.log(req.body.subPlace);
        let subPlace =await new SubPlace(req.body.subPlace);
        let subplace = await subPlace.save();
        console.log(subplace);
        let place = await Place.findById(id);
        place.subPlaces.push(subplace);
        let savedInstrument = await place.save();
        console.log(savedInstrument);

        res.redirect('back');


        
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/posts/all',async(req,res)=>{
    try{
        let places = await Place.find({});
        res.render('places/all',{places});

    }
    catch(err){
        console.log(err.message);
    }
})


//-------------------
// New form for place page
//-----------------

router.get('/posts/new', async(req,res)=>{
    try {
        let requestUrl = '/intruments/posts/new';
        res.render('places/new',{requestUrl});
        
    } catch (error) {
        console.log(error.message);
        
    }
    })

router.get('/posts/:id',async(req,res)=>{
    try {
        let id = req.params.id;
        let requestUrl = '/places/posts/'+id;
        let place = await Place.findById(id).populate('comments').populate('subPlaces');
        //console.log(place);
        res.render('places/show',{place,requestUrl});

    } catch (error) {
    console.log(error.message);        
    }
})
router.get('/posts/:id/admin',async(req,res)=>{
    try {
        let id = req.params.id;
        let requestUrl = '/places/posts/'+id;
        let place = await Place.findById(id).populate('comments').populate('subPlaces');
        //console.log(place);
        res.render('places/showAdmin',{place,requestUrl});

    } catch (error) {
    console.log(error.message);        
    }
})




//--------------
// Post route for posting new place to visit
//------------

router.post('/posts',async(req,res)=>{
    try {
        
        console.log("Post Triggered")
        let newPlace = await Place.create({

            title:req.body.title,
            image:req.body.image,
            imageSource:req.body.imageSource,
            thumbnail:req.body.thumbnail,
            content:req.body.content

        });

        let place = await newPlace.save();
        
        res.redirect('/places');
        
    } catch (error) {
        console.log(error.message);
        
    }
})


router.get('/posts/:id/edit',async(req,res)=>{
    try {

        let id = req.params.id;
        let requestUrl = '/places/posts/'+id+'/edit';
        let place = await Place.findById(id);
        res.render('places/edit',{place,requestUrl});
        
    } catch (error) {
        console.log(error.message);        
    }
})


//--------------
// update route for posting new interview
router.put('/posts/:id',async(req,res)=>{
    try {
        let id = req.params.id;
        console.log('Put Method Triggered');
        
        let place = await Place.findById(id);

        const {title , thumbnail , image , content} = req.body.place;
    if(content!==""){
        place.content = content;
    }
    place.title = title;
    place.image = image;
    place.thumbnail = thumbnail;
    let savedPlace = await place.save();
    
        res.redirect('/places/posts/'+id);
        
    } catch (error) {
        console.log(error.message);
        
    }
})
//-----------------
// delete route for deleting new interview
router.get('/posts/:id/delete',async(req,res)=>{
    try{

        let id = req.params.id;
        await Place.findByIdAndRemove(id);
        res.redirect('/places');
    }
    catch(error){
        console.log(error.message);
    }
})

router.post('/posts/:id/comments',async(req,res)=>{
    try{
        console.log('comment triggerred');
        let newcomment = await Comment.create(req.body.comment);
        let comment = await newcomment.save();
        let id = req.params.id;
        let place = await Place.findById(id);
        place.comments.push(comment);
        let savedinstrument = await place.save();
        res.redirect('back');

    }
    catch(err){
console.log(err.message);
    }
})




router.get('/posts/:id/admin/comments',async(req,res)=>{
    try {
        let id = req.params.id;
        let requestUrl = '/places/posts/'+id+'/admin/comments';
        let place = await Place.findById(id).populate('comments');
        let comments = place.comments;
        res.render('places/commentAdmin',{comments,requestUrl});
        
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
        console.log(error.message)
    }
})

router.get('/posts/:id/subPlaces/:sid/edit',async(req,res)=>{
    try {
        let sid = req.params.sid;
        let id = req.params.id;
        let subPlace = await SubPlace.findById(sid);
        res.render('places/subPlaceEdit',{subPlace,id});
        
    } catch (error) {
        console.log(error.message);
    }
})
router.post('/posts/:id/subPlaces/:sid',async(req,res)=>{
    try {
        
        console.log("Put method triggered");
        let sid = req.params.sid;
        let id = req.params.id;
        console.log(req.body.subPlace);
        let subplace = await SubPlace.findById(sid);
        const {title ,  image , imageSource , content} = req.body.subPlace;
        if(content!==""){
            subplace.content = content;
        }
        subplace.title = title;
        subplace.image = image;
        subplace.imageSource=imageSource;
        let savedSubinstrument = await subplace.save();
        
        res.redirect('/places/posts/'+id);
        
        
        } catch (error) {
            console.log(error.message);
            
        }
})
router.get('/posts/:id/subPlaces/:sid/delete',async(req,res)=>{
    try {
        console.log('im hitting it');
        let sid = req.params.id;
        SubPlace.findByIdAndRemove(sid);
        res.redirect('back');
        
    } catch (error) {
        console.log(error);
    }
})



//-------------------------update route for subplace------------------------//
/*router.put('/posts/places/subPlaces/:sid', async(req,res)=>{
    
    
  })
  */

  module.exports=router;
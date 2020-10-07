const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const SubPlace =require('../models/SubPlace');
const Comment = require('../models/Comment');

router.get('/', async(req,res)=>{
try {
    const reverse = arr => arr.map((_, index) => arr[arr.length - 1 - index]);
    let Allplaces = await Place.find({});
    let arr=[];
    let i=-1;
    let Attracción_Turística= ["5ef33d9d1adcce0c8cc2e8cf","5ef9959719c21a05c3d62a2e","5f0d7c2f679eb35a122d0af6","5f0d7fef679eb35a122d0b02","5f12f245e6a3b25f0f3e7b19","5f12f7abe6a3b25f0f3e7b25"];
    let Lugares_Históricos=["5ef99fbb19c21a05c3d62a46","5f101a85e6a3b25f0f3e7ae9","5f14476fe6a3b25f0f3e7b46","5f180219bceea105955677cd"];
    let Conzca_a_la_India=["5ef8188958adde056651db10","5ef9984719c21a05c3d62a37","5ef999ff19c21a05c3d62a38","5ef99d1419c21a05c3d62a3c"];
    let Gastronomía_India=["5f1fe063b018fa055ba1075b","5f212e0c9f4ffb1290288541"];
    let Otros_Articulos=["5f0eb011e6a3b25f0f3e7ab5","5efaf0dd19c21a05c3d62a54","5f101d98e6a3b25f0f3e7af0","5f0eab83e6a3b25f0f3e7aa9"]
    Allplaces.forEach(data=>{
        i++;
        let tag = data.tag;
        if(i%4==0)
        var obj={title:data.title,thumbnail:data.thumbnail,tag:tag,colIndex:0,id:data._id};
        else if(i%4==1)
        var obj={title:data.title,thumbnail:data.thumbnail,tag:tag,colIndex:1,id:data._id};
        else if(i%4==2)
        var obj={title:data.title,thumbnail:data.thumbnail,tag:tag,colIndex:2,id:data._id};
        else if(i%4==3)
        var obj={title:data.title,thumbnail:data.thumbnail,tag:tag,colIndex:3,id:data._id};
        arr.push(obj);
    })
    let places= reverse(arr);
    console.log(places);
    res.render('places/index',{places,Attracción_Turística,Lugares_Históricos,Conzca_a_la_India,Gastronomía_India,Otros_Articulos});

    
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

const express = require('express');
const router = express.Router();
const Instrument = require('../models/Intstrument');
const SubInstrument =require('../models/SubInstrument');
const Comment = require('../models/Comment');
const cacheData = require('../middleware/cacheData');

router.get('/', cacheData.memoryCacheUse(36000),async(req,res)=>{
try {
    let requestUrl = '/instruments';
    let instrumentz = await Instrument.find({}).populate('subInstruments');
    let instruments = [];
    
    res.render('musical/index',{instruments:instrumentz,requestUrl});
    
} catch (error) {
    console.log(error.message);
    
}
})
/*
//-----------------get route for subinstrument form-------------------//
router.get('/posts/:id/addMoreInformation',async(req,res)=>{
    try {
        let id = req.params.id;
        res.render('musical/addMorInformation',{id});
        
    } catch (error) {
        console.log(error.message);
    }
})

router.post('/posts/:id',async(req,res)=>{
    try {
        let id = req.params.id
        console.log(req.body.subInstrument);
        let subInstrument =await new SubInstrument(req.body.subInstrument);
        let subinstrument = await subInstrument.save();
        console.log(subinstrument);
        let instrument = await Instrument.findById(id);
        instrument.subInstruments.push(subinstrument);
        let savedInstrument = await instrument.save();
        console.log(savedInstrument);

        res.redirect('back');


        
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/posts/all',async(req,res)=>{
    try{
        let instruments = await Instrument.find({});
        res.render('musical/all',{instruments});

    }
    catch(err){
        console.log(err.message);
    }
})


//-------------------
// New form for instrument page
//-----------------

router.get('/posts/new', async(req,res)=>{
    try {
        let requestUrl = '/intruments/posts/new';
        res.render('musical/new',{requestUrl});
        
    } catch (error) {
        console.log(error.message);
        
    }
    })

router.get('/posts/:id',async(req,res)=>{
    try {
        let id = req.params.id;
        let requestUrl = '/instruments/posts/'+id;
        let instrument = await Instrument.findById(id).populate('comments').populate('subInstruments');
        //console.log(instrument);
        res.render('musical/show',{instrument,requestUrl});

    } catch (error) {
    console.log(error.message);        
    }
})
router.get('/posts/:id/admin',async(req,res)=>{
    try {
        let id = req.params.id;
        let requestUrl = '/instruments/posts/'+id;
        let instrument = await Instrument.findById(id).populate('comments').populate('subInstruments');
        //console.log(instrument);
        res.render('musical/showAdmin',{instrument,requestUrl});

    } catch (error) {
    console.log(error.message);        
    }
})




//--------------
// Post route for posting new interview
//------------

router.post('/posts',async(req,res)=>{
    try {
        if(req.files){
        let audio = req.files.audio;
        console.log(audio);
        console.log(audio.name);
        audio.mv(`./public/audios/${audio.name}`, err => console.log(err ? 'audio on save the image!' : 'Audio Uploaded!'));
        
    }
    else{
        audio={};
        audio.name="";
    }
        console.log("Post Triggered")
        let newInstrument = await Instrument.create({
            title:req.body.title,
            image:req.body.image,
            imageSource:req.body.imageSource,
            thumbnail:req.body.thumbnail,
            content:req.body.content,
            audio:audio.name,

        });

        let instrument = await newInstrument.save();
        
        res.redirect('/instruments/posts/'+instrument._id);
        
    } catch (error) {
        console.log(error.message);
        
    }
})


router.get('/posts/:id/edit',async(req,res)=>{
    try {

        let id = req.params.id;
        let requestUrl = '/instruments/posts/'+id+'/edit';
        let instrument = await Instrument.findById(id);
        res.render('musical/edit',{instrument,requestUrl});
        
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
        
        let instrument = await Instrument.findById(id);

        const {title , thumbnail , image , content} = req.body.instrument;
    if(content!==""){
        instrument.content = content;
    }
    instrument.title = title;
    instrument.image = image;
    instrument.thumbnail = thumbnail;
    let saveInstrument = await instrument.save();
    
        res.redirect('/instruments/posts/'+id);
        
    } catch (error) {
        console.log(error.message);
        
    }
})
//-----------------
// delete route for deleting new interview
router.get('/posts/:id/delete',async(req,res)=>{
    try{

        let id = req.params.id;
        await Instrument.findByIdAndRemove(id);
        res.redirect('/instruments');
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
        let instrument = await Instrument.findById(id);
        instrument.comments.push(comment);
        let savedinstrument = await instrument.save();
        res.redirect('back');

    }
    catch(err){
console.log(err.message);
    }
})




router.get('/posts/:id/admin/comments',async(req,res)=>{
    try {
        let id = req.params.id;
        let requestUrl = '/instruments/posts/'+id+'/admin/comments';
        let instrument = await Instrument.findById(id).populate('comments');
        let comments = instrument.comments;
        res.render('musical/commentAdmin',{comments,requestUrl});
        
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

router.get('/posts/:id/subInstruments/:sid/edit',async(req,res)=>{
    try {
        let sid = req.params.sid;
        let id = req.params.id;
        let subInstrument = await SubInstrument.findById(sid);
        res.render('musical/subInstrumentEdit',{subInstrument,id});
        
    } catch (error) {
        console.log(error.message);
    }
})
router.post('/posts/:id/subInstruments/:sid',async(req,res)=>{
    try {
        
        console.log("Put method triggered");
        let sid = req.params.sid;
        let id = req.params.id;
        console.log(req.body.subInstrument);
        let subinstrument = await SubInstrument.findById(sid);
        const {title ,  image , imageSource , content} = req.body.subInstrument;
        if(content!==""){
            subinstrument.content = content;
        }
        subinstrument.title = title;
        subinstrument.image = image;
        subinstrument.imageSource=imageSource;
        let savedSubinstrument = await subinstrument.save();
        
        res.redirect('/instruments/posts/'+id);
        
        
        } catch (error) {
            console.log(error.message);
            
        }
})
router.get('/posts/:id/subInstruments/:sid/delete',async(req,res)=>{
    try {
        console.log('im hitting it');
        let sid = req.params.id;
        SubInstrument.findByIdAndRemove(sid);
        res.redirect('back');
        
    } catch (error) {
        console.log(error);
    }
})



//-------------------------update route for subinstrument------------------------//
/*router.put('/posts/instruments/subInstruments/:sid', async(req,res)=>{
    
    
  })
  */
 

  module.exports=router;
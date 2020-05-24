const express = require('express');
const router = express.Router();
const Instrument = require('../models/Intstrument');
const Comment = require('../models/Comment');

router.get('/', async(req,res)=>{
try {
    let carouselItems = await Instrument.find({}).limit(3);
    console.log(carouselItems);
    let requestUrl = '/instruments';
    let instruments = await Instrument.find({}).sort({created:-1}).limit(4);
    res.render('musical/index',{instruments,carouselItems,requestUrl});
    
} catch (error) {
    console.log(error.message);
    
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
        let instrument = await Instrument.findById(id).populate('comments');
        res.render('musical/show',{instrument,requestUrl});

    } catch (error) {
    console.log(error.message);        
    }
})



//--------------
// Post route for posting new interview
//------------

router.post('/posts',async(req,res)=>{
    try {

        let audio = req.files.audio;
        console.log(audio);
        console.log(audio.name);
        audio.mv(`./public/audios/${audio.name}`, err => console.log(err ? 'audio on save the image!' : 'Audio Uploaded!'));
        
        console.log("Post Triggered")
        let newInstrument = await Instrument.create({
            title:req.body.title,
            image:req.body.image,
            thumbnail:req.body.thumbnail,
            content:req.body.content,
            audio:audio.name
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
        let instrument = await Instrument.findByIdAndUpdate(id,req.body.instrument);
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

  module.exports=router;
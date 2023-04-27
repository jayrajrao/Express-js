const mongoose =require('mongoose')

// define schema 
const AboutSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true
    }
    
},{timestamps:true})


// create collection             
const AboutModel= mongoose.model('about',AboutSchema)
//                                   ^ collection name  


module.exports=AboutModel
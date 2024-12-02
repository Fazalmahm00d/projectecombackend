const mongoose=require('mongoose');


const authSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:[true,"email already exists"]
    },
    password:{
        type:String,
        required:true,
    }
})

const authenticate=mongoose.model('authentication',authSchema)

module.exports=authenticate
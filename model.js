const mongoose=require('mongoose');

const schema=mongoose.Schema;


const todoSchema=new schema({
    task:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default:Date.now(),
    },
    complete:{
        type:Boolean,
        default:false
    },
})

const todo=mongoose.model('todos',todoSchema)

module.exports=todo


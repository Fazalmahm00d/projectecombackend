const mongoose=require('mongoose');


const expenseSchema=new mongoose.Schema({
    amount:{
        type:Number,
    },
    desc:{
        type:String
    },
    date:{
        type:String,
    },
    select:{
        type:String,
    } 
})

const expense=mongoose.model('expense',expenseSchema);

module.exports=expense;

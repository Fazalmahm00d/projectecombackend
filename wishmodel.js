const mongoose=require('mongoose')

const wishSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    items:[{
        img:{
            type:String,
        },
        name:{
            type:String,
        },
        desc:{
            type:String,
        },
        price:{
            type:Number,
        },

    }]
})

const wishlist=mongoose.model('wishlist',wishSchema);

module.exports=wishlist;
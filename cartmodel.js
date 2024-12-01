const mongoose=require('mongoose');




const cartSchema=new mongoose.Schema({
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
        quantity:{
            type:Number,
        }

    }]

})

const cart=mongoose.model('cart',cartSchema);

module.exports=cart;
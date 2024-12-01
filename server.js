const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors')
require('dotenv').config();
const Todo=require('./model')
const Expense=require('./expensemodel');
const Cart=require('./cartmodel')
const app=express();




const url=process.env.MONGO_URI;


app.use(cors())
app.use(express.json());


mongoose.connect(url).then(()=>{
    console.log("MongoDB is connected");
}).catch((err)=>{
    console.log("Error:",err)
})


app.post('/cart/new', async (req, res) => {
    const { email, img , name ,desc, price , quantity } = req.body;

    try {
        let cart = await Cart.findOne({ email });
        if (!cart) {
            cart = new Cart({
                email,
                items: [],
            });
        }
        const productIndex = cart.items.findIndex((item) => item.name === name);
        if (productIndex !== -1) {
            cart.items[productIndex].quantity += quantity;
            await cart.save();
            res.status(201).json({message:"Item quantity increased",cart})
        } else {
            cart.items.push({
                img,
                name,
                desc,
                price,
                quantity,
            });
            await cart.save();
            res.status(200).json({ message: "Cart updated successfully", cart });
        }
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/cart',async(req,res)=>{
    try{
        const cart=await Cart.find();
        res.json(cart)
    }
    catch(err){
        console.log(err,":error")
    }
})
app.get('/cart/:email', async (req, res) => {
    const { email } = req.params; 
    try {
        const cart = await Cart.findOne({ email });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/todo/new',async (req,res)=>{
    const todo=new Todo({
        task:req.body.task,
        complete:req.body.complete
    })
    await todo.save();
    res.json(todo);
})


app.delete('/cart/delete/:email/items/:id', async (req, res) => {
    const { email, id } = req.params;
    try {
        const cart = await Cart.findOne({ email });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = cart.items.filter((item) => item._id.toString() !== id);
        await cart.save();
        res.json({ message: "Item removed successfully", cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});



// app.post('/expensetracker/new',async(req,res)=>{
//     const expense= new Expense({
//         amount:req.body.amount,
//         descr:req.body.descr,
//         date:req.body.date,
//         select:req.body.select,
//     })
//     const responses=await expense.save();
//     res.json(responses)
// })
// app.get('/expensetracker',async(req,res)=>{
//     try{
//         const expenses=await Expense.find();
//         res.json(expenses)
//     }
//     catch(err){
//         console.log(err,"error")
//     }
// })
// app.post('/todo/new',async (request,response)=>{
//     console.log(request.body,"body")
//     const newTodo=new Todo({
//         text:request.body.text,
//     })
//     const saveTodo=await newTodo.save();
//     response.json(saveTodo);
// })




// app.post('/cart/new',async(req,res)=>{
//     const {email,productId,price,quantity,name}=req.body;
//     console.log(req.body)
//     try{
//     let cart=await Cart.findOne({email});
    
//     if(!cart){
//         cart =new Cart({
//             email,
//             items:[],
//         })
//     }
//     console.log(cart)
    
//     const productIndex=cart.items.findIndex((items)=>items.id=productId)
//     if(cart.items[productIndex].quantity===0){
//         quantity===1
//     }else{
//         quantity+=cart.items[productIndex].quantity;
//     }
//     const result=await cart.items.push({
//         productId,
//         price,
//         quantity,
//         name,
//     })
//     console.log(cart)
//     await cart.save()
//     res.json({cart})
//     }catch(error){
//         res.status(400,"error",error)
//     }
// })
// app.delete('/expensetracker/delete/:id',async(req,res)=>{
//     const result=Expense.findByIdAndDelete(req.params.id);
//     res.json(result)
// })
// app.get('/todo',async(request,response)=>{
//     try{
//         const todos=await Todo.find();
//         response.json(todos)
//     }
//     catch(err){
//         console.log("error:",err)
//     }
// })

// app.delete('/todo/delete/:id', async(req,res)=>{
//     const result=await Todo.findByIdAndDelete(req.params.id);
//     res.json(result);
// })

// app.put('/todo/put/:id',async(req,res)=>{
//     const result=await Todo.findById(req.params.id);
//     result.complete=true;
//     if(req.body.task){
//         result.task=req.body.task
//     }
//     const ress=await result.save()
//     res.json(ress)
// })

// app.get('/todo/:id', async(req,res)=>{
//     try{
//         const result=await Todo.findById(req.params.id);
//         res.json(result)
//     }
//     catch(err){
//         console.log(err)
//     }
// })
app.listen(8000,()=>{
    console.log('server is running on port 8000')
})
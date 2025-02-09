const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const cors=require('cors')
require('dotenv').config();
const Todo=require('./model')

const Expense=require('./expensemodel');
const Cart=require('./cartmodel');
const Authentication=require('./authmodel')
const WishList=require('./wishmodel');
const app=express();




const url=process.env.MONGO_URI;
const secret=process.env.JWT_SECRET;

// In your backend Express app

app.use(cors({
  origin: ['http://localhost:3000', 'https://nextprojecom.vercel.app/']
}));
app.use(express.json());


mongoose.connect(url).then(()=>{
    console.log("MongoDB is connected");
}).catch((err)=>{
    console.log("Error:",err)
})


app.post('/cart/new', async (req, res) => {
    const { email, img , name ,desc, price , quantity } = req.body;
    console.log(req.body ,"body send")
    try {
        let cart = await Cart.findOne({ email });
        console.log("cart found")
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
            return res.status(201).json({message:"Item quantity increased",cart})
        } else {
            cart.items.push({
                img,
                name,
                desc,
                price,
                quantity,
            });
            await cart.save();
            return res.status(200).json({ message: "Cart updated successfully", cart });
        }
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/register', async (req,res)=>{
    const { email, password}=req.body;
    try{
        const isEmail=await Authentication.findOne({ email });
        if(isEmail){
            res.status(409).json({message: "email already exists"})
        }
        else{
            const hash=await bcrypt.hash(password,10)
            const user=new Authentication({
                email,
                password:hash
            })
            const response=await user.save();
            const token=jwt.sign({email},"ske0293")

            res.status(201).json({ message: "user created successfully",response,token})
        }

    }
    catch(error){
        res.status(400).json({ error: error.message });
        
    }
})

app.post('/login', async (req,res)=>{
    const { email , password}=req.body;
    try{
        const isEmail=await Authentication.findOne({ email });
        if(isEmail){
            const isMatch=await bcrypt.compare(password, isEmail.password);
            if(isMatch){
                const token=jwt.sign(email,secret)
                res.status(200).json({message:"Login successfully",token})
            }else{
                res.status(401).json({ message:"Email or password is incorrect"})
            }
        }else{
            res.status(401).json({message:"Email or password is incorrect"})
        }
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
})
// app.post('/users/google',async(req,res)=>{
//     console.log("request body",req.body)
//     try{
//       const { email , username} =req.body;
//     const existingUser = await User.findOne({ email });
//       console.log("existing user",existingUser)
//     if(existingUser){
//       const token = generateToken();
//         res.cookie("authToken", token, {
//           httpOnly: true,
//           secure: true,
//           sameSite: "none",
//           maxAge: TOKEN_EXPIRATION_TIME,
//         });
//       res.status(200).json({ message: "Login successful",user: {
//         id: existingUser._id,
//         email: existingUser.email,
//         username: existingUser.username,
//       }
//       })
//     }
//     else{
      
//       const newUser = new User({
//         email,
//         username,
//         cart: [],
//         wishlist: []
//       });
//       console.log("newuser",newUser)
//       const savedUser = await newUser.save();
//       const token = generateToken();
//       res.cookie("authToken", token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//         maxAge: TOKEN_EXPIRATION_TIME,
//       });
//       console.log("Saved User:", savedUser);
//       res.status(201).json({
//         message: "User registered successfully",
//         user: {
//           id: savedUser._id,
//           email: savedUser.email,
//           username: savedUser.username,
//           idToken:token
//         },
//       });
//     }
//     }catch(error){
//       res.status(500).json({ message: "Server error", error });
  
//     }
  
  
//   })
app.post('/wishlist/new', async (req,res) =>{
    const {email, img , name ,desc, price} =req.body;
    try {
        let wishlist = await WishList.findOne({ email });
        if (!wishlist) {
            wishlist = new WishList({
                email,
                items: [],
            });
        }
        const productIndex = wishlist.items.findIndex((item) => item.name === name);
        if (productIndex !== -1) {
            await wishlist.save();
            res.status(201).json({message:"Item already added in wishlist",wishlist})
        } else {
            wishlist.items.push({
                img,
                name,
                desc,
                price,
                
            });
            await wishlist.save();
            res.status(200).json({ message: "Wishlist updated successfully", wishlist });
        }
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})
app.get('/cart',async(req,res)=>{
    try{
        const cart=await Cart.find();
        res.json(cart)
    }
    catch(err){
        console.log(err,":error")
    }
})

app.get('/wishlist',async(req,res)=>{
    try{
        const wishlist=await WishList.find();
        res.json(wishlist);
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

app.get('/wishlist/:email',async (req,res)=>{
    const {email}=req.params;
    try{
        const wishlist=await WishList.findOne({ email });
        if(!wishlist){
            return res.status(404).json({ message: "Wishlist not found" })
        }
        res.status(200).json(wishlist)
    }
    catch(error) {
        res.status(500).json({ error: error.message });
    }
})

// app.post('/todo/new',async (req,res)=>{
//     const todo=new Todo({
//         task:req.body.task,
//         complete:req.body.complete
//     })
//     await todo.save();
//     res.json(todo);
// })


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

app.delete('/wishlist/delete/:email/items/:id', async (req,res)=>{
    const { email , id }=req.params;
    try{
        const wishlist = await WishList.findOne({ email });

        if (!wishlist) {
            return res.status(404).json({ message: "Cart not found" });
        }
        wishlist.items = wishlist.items.filter((item) => item._id.toString() !== id);
        await wishlist.save();
        res.json({ message: "Item removed successfully", wishlist });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
})


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
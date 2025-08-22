const express=require('express');
const dotEnv =require('dotenv');
const mongoose=require('mongoose');
const vendorRoutes=require('./routes/vendorRoutes')
const bodyparser=require('body-parser');
const cors=require('cors');
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes')
const path=require('path');

const app=express();
const PORT=4000;
dotEnv.config();

app.use(bodyparser.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("db connected successfully"))
.catch((err)=>console.log(err))

app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));


app.listen(PORT,()=>{
  console.log(`server started and running at ${PORT}`)
})

app.use('/',(req,res)=>{
  res.send('<h1>Welcome swiggy Clone</h1>')
})


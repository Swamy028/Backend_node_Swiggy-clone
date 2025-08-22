const Vendor=require('../models/Vendor')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotEnv=require('dotenv');

dotEnv.config();

const secret_key=process.env.SECRET;


const vendorRegister= async(req,res)=>{
  try{
    const{username,email,password}=req.body;
    const vendorEmail=await Vendor.findOne({email});
    if(vendorEmail){
      return res.status(400).json("Email already existed");
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const newVendor=new Vendor({
      username,
      email,
      password:hashedPassword
    })
    await newVendor.save();
      res.status(201).json({msg:"vendor registered successfully"}).json(newVendor);
      console.log("Registered");
  }
  catch(err){
      res.status(500).json({err:"internal server error"});
      console.log(err)
  }
}

const vendorLogin=async(req,res)=>{
  const{email,password}=req.body;
  try{
      const vendor=await Vendor.findOne({email});
      if(!vendor||!(await bcrypt.compare(password,vendor.password))){
          return res.status(400).json({err:"Invalid credentials"})
      }

      const token=jwt.sign({vendorId:vendor._id},
        secret_key,
        {expiresIn:"1h"}
      );

      res.status(200).json({msg:"login successful",token,vendorId:vendor._id});
      console.log(email);
  }
  catch(err){
      res.status(500).json({err:"internal server error"});
      console.log(err)
  }
}
const getAllVendors=async(req,res)=>{
  try {
    const vendors=await Vendor.find().populate('firm');
    res.status(201).json({vendors});
  } catch (error) {
    res.status(500).json({err:"internal server error"});
      console.log(error)
  }
}

const getSingleVendor=async(req,res)=>{
  const vendorId=req.params.id;
  try{
    const vendor=await Vendor.findById(vendorId).populate('firm');
    if(!vendor){
      return res.status(201).json({msg:"vendor not found"});
    }
    res.status(201).json({vendor});

  }
  catch(err){
    res.status(500).json({err:"internal server error"});
      console.log(err)
  }
}

module.exports={vendorRegister,vendorLogin,getAllVendors,getSingleVendor}
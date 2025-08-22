const Firm =require('../models/Firm');
const Vendor=require('../models/Vendor');
const multer=require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // folder where files will be stored
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // unique filename: timestamp + original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const addFirm=async(req,res)=>{
  try{
    const {firmName,area,category,region,offer}=req.body;

    const image=req.file?req.file.filename:undefined;


    const vendor=await Vendor.findById(req.vendorId);

    if(!vendor){
      res.status(400).json({error:"vendor not found"})
    }

    const firm=new Firm({
      firmName,area,category,region,offer,image,vendor:vendor._id
    })
    
    const savedfirm=await firm.save();

    vendor.firm.push(savedfirm._id);
    await vendor.save();

    res.status(200).json({message:"firm added successfully"})

  }
  catch(error){
      console.error(error);
      res.status(400).json("internal server error");
  }
}


const deleteFirmById=async(req,res)=>{
  try {
    const firmId=req.params.firmId;
    const deletedFirm=await Firm.findByIdAndDelete(firmId);

    if(!deletedFirm){
      return res.status(404).json({msg:"Firm not found to delete"});

    }

    res.status(201).json({msg:"firm deleted successfully"})
  } catch (error) {
    console.error("error at firm controller delete catch block",error);
     res.status(401).json({error:"server error at firmcontroller delete catch block"})
  }
}


module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}
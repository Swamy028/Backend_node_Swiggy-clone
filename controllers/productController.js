const Product=require('../models/Product');
const multer=require('multer');
const path =require('path')
const Firm =require('../models/Firm')


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

const addProduct=async(req,res)=>{
  try {
    const {productName,price,category,bestseller,description}=req.body;
     const image=req.file?req.file.filename:undefined;

    const firmId=req.params.firmId;
    const firm=await Firm.findById(firmId);

    if(!firm){
      res.status(201).json({error:"No firm found at prdCntrl at line 29"})
    }

    const product=new Product({
      productName,price,category,bestseller,image,description,firm:firm._id
    })

    const savedProduct=await product.save();
    firm.products.push(savedProduct);
    await firm.save();

    res.status(200).json(savedProduct);

  } catch (error) {
     console.error("error at product controller catch block",error);
     res.status(401).json({error:"server error at productController catch block"})
  }
}

const getProductByFirm=async(req,res)=>{
  try {
    const firmId=req.params.firmId;
    const firm=await Firm.findById(firmId);
    if(!firm){
      res.status(404).json({error:"no firm found"});
    }
    
    const restaurantName=firm.firmName;
    const product=await Product.find({firm:firmId});
    res.status(201).json({restaurantName,product});

    
  } catch (error) {
     console.error("error at product controller catch block",error);
     res.status(401).json({error:"server error at productController catch block"})
  }
}

const deleteProductById=async(req,res)=>{
  try {
    const productId=req.params.productId;
    const deletedProduct=await Product.findByIdAndDelete(productId);

    if(!deletedProduct){
      return res.status(404).json({msg:"product not found to delete"});

    }

    res.status(201).json({msg:"product deleted successfully"})
  } catch (error) {
    console.error("error at product controller delete catch block",error);
     res.status(401).json({error:"server error at productController delete catch block"})
  }
}

module.exports={addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById}
const firmController=require('../controllers/firmController');
const router=require('express').Router();
const verifyToken=require('../middlewares/verifyToken');

router.post('/add-firm',verifyToken,firmController.addFirm);
router.delete('/delete/:firmId',firmController.deleteFirmById);

router.get('/uploads/:imageName',(req,res)=>{
  const imageName=req.params.imageName;
  res.headersSent('Content-Type','image/jpg');
  res.sendFile(path.join(__dirname,'..','uploads',imageName))
})

module.exports=router;
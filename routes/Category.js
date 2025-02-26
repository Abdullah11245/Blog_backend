const express =require('express');
let router = express.Router();
const path=require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Category=require('../models/categories');
const SubCategory=require('../models/SubCategory')
router.post('/category',async(req,res)=>{
  try {
    let Category =await Category.findOne({category:req.body.category})
    if(Category){
        return res.send({message:'This category already exist'})
    }
    else{
        const category =await new Category ({
          category:req.body.category
          })
          await category.save()
          return res.status(200).json(category)

    }

  } catch (error) {
    console.log(error)
  }
    
})
router.post('/allCategories',async(req,res)=>{
  let Category=await Category.find({category:req.body.category})

})

router.post('/subcategory',async(req,res)=>{

    try {

        let category = await Category.findById(req.query.id)
        console.log (category);
        let subcategory = await new SubCategory(req.body);
        subcategory.category=category.id;
        await subcategory.save();
        res.send({message:"Success",subcategory});
    } catch (error) {
        res.send(error.message);
    }
})
module.exports = router;

const express =require('express');
const path=require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
let router = express.Router();
let User = require('../models/user');
let Post = require('../models/editor');
let Promotion =require('../models/promotion')

router.post('/promotion', async (req, res) => {
    try {
        // const { userId, postId } = req.body; // Assuming userId and postId are sent in the request body

        const user = await User.findById('6603305afa2920758c566d03');
        const post = await Post.findById('65fea150ee015fb2c3866660');

        if (!user || !post) {
            return res.status(400).json({ error: 'Please contact the Admin' });
        } else {
            const promote = new Promotion({
                user: user,
                post: post,
                status:'warning'
            });

            await promote.save(); // Save the promotion to the database

            return res.status(200).json({ message: 'Request sent successfully', promotion: promote });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/allPromtions',async(req,res)=>{
  const promoted=await Promotion.find()
 
})

router.post('/promoted',async(req,res)=>{
    try {
   if(req.body.status ==true){


   }else if(req.body.status ==false){


   }

    } catch (error) {
       
        console.log(error)
    }
 
})
module.exports = router;

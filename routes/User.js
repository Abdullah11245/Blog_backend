const express = require('express');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
let jsonwebtoken = require('jsonwebtoken');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
let User = require('../models/user');
let Token = require('../models/token');
const crypto = require('crypto');

// Ensure Cloudinary configuration is present
if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  console.error('Missing Cloudinary configuration. Make sure to set CLOUD_NAME, API_KEY, and API_SECRET.');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: process.env.SECURE,
});

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
});

let router = express.Router();


router.post('/signup', upload.single('userImage'), async (req, res) => {
  console.log(req.body)
  try {
    let userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).json({ error: 'User Already Exists' });
    }
    else{
      if (!req.file) {
        throw new Error('No image file provided');
      }
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
          folder: 'profile-photos',
        });
         const user =await new User ({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password, // Ensure you hash the password before storing
                    userImage: result.secure_url,
                    preference:req.body.preference
                  })
           await user.save();
           return res.status(200).json({ result: user });

    }
   
    
     

    

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.post('/login', async (req, res) => {
   console.log(req.body.email)
    try {
        let userEmail = await User.findOne({ email: req.body.email });
        let userPassword = await User.findOne({ password: req.body.password });
        console.log(userEmail,'user')
        console.log(userPassword,'password')
        if (!userEmail || !userPassword) {
          return res.send({ message: "Invalid Email or password" });
        }
        let user = await User.findOne(req.body).lean();
        console.log(user);
        console.log(user.verified);
        if (user.verified === false) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
                console.log(url);
                // await sendEmail(user.email, "Verify Email", url);
                res.send({ message: "An Email sent to your account please verify" })
            } else if (token) {
              res.send({ message: "An Email sent to your account please verify" });
            }
        }

        if (user.verified === true) {

            jsonwebtoken.sign({
                id: user._id
            }, "Its all about you", {
                expiresIn: "12h"
            }, (err, UserToken) => {
                res.json({
                    utoken: UserToken,
                    user: user,
                    message:"Login Successfully"
                    
                });
            })
  
        }
    }

    catch (error) {
        console.log(error.message)
    }
});




module.exports = router;

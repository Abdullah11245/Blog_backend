const express = require('express');
const bodyParser = require('body-parser');
const { JSDOM } = require('jsdom');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const showdown = require('showdown');
const multer = require('multer');
const markdownIt = require('markdown-it');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
let TurndownService = require('turndown');
let turndownService = new TurndownService()
let Post = require('../models/editor');
let router = express.Router();
const marked = require('marked');
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
router.use(bodyParser.json({ limit: '50mb' }));

turndownService.addRule('fontFace', {
  filter: ['font'],
  replacement: function (content, node) {
    let fontFamily = node.getAttribute('face');
    if (fontFamily) {
      return `<span style="font-family: ${fontFamily};">${content}</span>`;
    }
    return content;
  }
});

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  console.error('Missing Cloudinary configuration. Make sure to set CLOUD_NAME, API_KEY, and API_SECRET.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: process.env.SECURE,
});


const upload = multer({ storage: multer.memoryStorage() });

router.post('/post/:id', upload.single('postimage'), async (req, res) => {
  try {
    const userId = req.params.id;

    console.log(req.file);

    console.log(req.body);

    const markdownContent = turndownService.turndown(req.body.content);

    let uploadedImageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
        folder: 'post-images',
      });
      uploadedImageUrl = result.secure_url;
    } else {
      console.log('No image uploaded'); 
    }

    const post = new Post({
      content: markdownContent,
      userId: userId,
      title: req.body.title,
      category: req.body.category,
      subCategory: req.body.subCategory,
      postimage: uploadedImageUrl || '', 
    });

    await post.save();
    res.send('Post saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});


router.get('/postDisplay/:id', async (req, res) => {
  try {
    const md = markdownIt();
    const postId = '67be56b1ca3d7a5c291f5042'; 

    // Fetch the post by ID from your database
    const post = await Post.findById(postId);
    console.log(post)

    if (!post) {
      return res.status(404).send('Post not found'); 
    }

    const htmlContent = md.render(post.content);

    res.send({htmlContent,post});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }   
});
module.exports = router;

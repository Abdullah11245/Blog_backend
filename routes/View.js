// routes/blog.js

const express = require('express');
const router = express.Router();
const BlogPost = require('../models/editor');

router.post('/:postId/view', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Find the blog post by ID
    const blogPost = await BlogPost.findById(postId);

    // If the blog post doesn't exist, return a 404 response
    if (!blogPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment the view count
    blogPost.views++;
    
    // Save the updated blog post
    await blogPost.save();

    console.log(`View counted for post ${postId}`);
    res.status(200).end();
  } catch (error) {
    console.error('Error counting view:', error);
    res.status(500).end();
  }
});

module.exports = router;

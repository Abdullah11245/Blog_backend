const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const User = require('../models/user');
const router = express.Router();

router.post('/followings', async (req, res) => {
    console.log(req.body)
    try {
        const userId ='6603305afa2920758c566d03';
        const followerId ='66033076fa2920758c566d06';

        // Find the user to follow
        const userToFollow = await User.findById(userId);
        console.log(userToFollow,'user')
        if (!userToFollow) {
            return res.status(200).json({ error: 'User not found' });
        }

        // Find the follower
        const follower = await User.findById(followerId);
        console.log(follower,'follow')
        if (!follower) {
            return res.status(200).json({ error: 'Follower not found' });
        }
        // Check if the follower is already following the user
        if (userToFollow.followers.includes(follower._id)) {
            return res.status(400).json({ error: 'User is already being followed' });
        }

        // Add follower to the user's followers list
        userToFollow.followers.push(follower);
        await userToFollow.save();

        // Optionally, you can also add the user to the follower's following list

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

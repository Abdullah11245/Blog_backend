const express = require('express');
const cors = require('cors');
const connectDB = require('./dbConfig/db');
const path=require('path')
const app = express();
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// Check for Cloudinary configuration



const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
const UserRoute = require('./routes/User');
const PostRoute = require('./routes/Editor');
const FollowRoute=require('./routes/Follow')
const PromotionRoute=require('./routes/Promotion')
// const CategoryRoute=require('./routes/Category')
app.use('/user',UserRoute);
app.use('/editor',PostRoute);
app.use('/follow',FollowRoute)
app.use('/promotion',PromotionRoute)
// app.use('/category',CategoryRoute)



// app.post('/user/signup', upload.single('userImage'), async (req, res) => {
//   try {
//     if (!req.file) {
//       throw new Error('No image file provided');
//     }

//     const result = await cloudinary.uploader.upload_stream({ folder: 'profile-photos' }, (error, result) => {
//       if (error) {
//         console.error('Error uploading to Cloudinary:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         // Other processing logic can go here

//         res.status(200).json({ message: 'File uploaded successfully', imageUrl: result.secure_url });
//       }
//     }).end(req.file.buffer);

//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running continuously at ${PORT}`);
});

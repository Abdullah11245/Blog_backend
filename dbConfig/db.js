const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const DB = process.env.DATABASE_URI

const connectDB = async () => {
  try {
    await mongoose.connect(DB);

    console.log("Database Connected");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;

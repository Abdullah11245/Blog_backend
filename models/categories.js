const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    category:{
        type:String
    }
})

module.exports = mongoose.model('categories',categorySchema);
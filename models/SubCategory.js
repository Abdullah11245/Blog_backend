const mongoose = require('mongoose');

let subCategorySchema = mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories'
    },
    subCategory:{
        type:String
    }
})

module.exports = mongoose.model('subCategories',subCategorySchema);
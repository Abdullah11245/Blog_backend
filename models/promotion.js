const mongoose = require('mongoose');

let promotionSchema = mongoose.Schema({
    user:{
        type:Object,
        required:true
    },
    post:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('promotion',promotionSchema);
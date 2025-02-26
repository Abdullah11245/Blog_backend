let mongoose = require("mongoose");
const user = require("./user");

let postSchema = mongoose.Schema({
    title:{
        type:String,
     required:true
    },
    postimage:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    View:{
        type:Number,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

   
});

module.exports = mongoose.model("post",postSchema);
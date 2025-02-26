let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    userImage:{
        type:String,
        required:true
    },
    preference:{
        type:String,
        required:true
    },
    followers:{
        type:[]
    },
    verified:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model("user",userSchema);
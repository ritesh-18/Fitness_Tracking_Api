const mongoose = require("mongoose");
const userSchema= mongoose.Schema({
    name:{
        type:String,
       required:[true , "Name is required"]

    },
    email:{
        type:String,
        required:[true , "Email is required"],
    },
    password:{
        type:String,
        required:[true , "Password is required"],
    },
    age:{
           type:Number,
           required:[true , "Age is required"],
           min:10
    }

},{timestamps:true})
const Usermodel = mongoose.model("users", userSchema);
module.exports=Usermodel;
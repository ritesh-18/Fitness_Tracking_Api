const mongoose = require("mongoose")
const foodSchema= mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    calories:{
        type:Number,
        required:true
    },
    protien:{
        type:Number,
        required:true
    },
    carbohydrates:{
        type:Number,
        required:true
    },
    fat:{
        type:Number,
        required:true
    },
    fibre:{
        type:Number,
        required:true
    }


},{timestamps:true})
//creating model
const foodmodel=mongoose.model("foods",foodSchema);
module.exports=foodmodel;
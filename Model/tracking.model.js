const mongoose = require("mongoose")

const trackingSchema=mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  },
  foodId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"foods"
  },
  quantity:{
    type:Number,
    min:1,
    required:true
  }
,
date:{
  type:String,
  default:new Date().toLocaleDateString()
}


},{timestamps:true})
const trackingModel=mongoose.model("trackings" , trackingSchema)
module.exports=trackingModel
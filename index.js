const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("./Model/user.model");
const foodmodel=require("./Model/food.model")
const trackingModel=require("./Model/tracking.model")
//creating server
const app = express();
app.use(express.json()); //middleware

//* db connection
mongoose
    .connect("mongodb://localhost:27017/fitnessData")
    .then(() => {
        console.group("Db connected successfully");
    })
    .catch((err) => {
        console.error("error occur : ", err);
    });

//creating Endpoints
// * TODO : {register , login , search food by name , track food by name , show my tracked foods}

app.post("/register", async(req, res) => {
    let userData = req.body;
    let user= await userModel.findOne({email:userData.email}) // checking user already exist or not?
    // console.log(exit)
    if(!user){
        try{
            bcrypt.genSalt(10 , (err, salt)=>{
                if(!err){
                 bcrypt.hash(userData.password , salt , async(err, hashpassword)=>{
                   if(!err){
                     userData.password=hashpassword;
                     try{
                         let data = await userModel.create(userData);
                         res.json({message : "User created successfully", data : data});
                     }
                     catch(err) {
                         res.status(500).send({ message: "Some problem while inserting Data " });
                     }
                   }
                 })
                }
            })
        }
        catch(err){
            res.status(400).send({ message: "error occur " ,
                error : err
            });
        }
    }


    else{
        res.status(400).send({
            message:"user already Exist"
        })
    }

      
});

//todo: Endpoint for Login 
app.post("/login" ,async (req, res)=>{
    let userCred=req.body;
  
   try {
    let user=await userModel.findOne({email:userCred.email})
    if(user!==null){
     //email exist in DB now check for Password
     bcrypt.compare(userCred.password , user.password ,(err, success)=>{
        if(success){
            //generate token and send back to the user 

           jwt.sign({email:userCred.email} , "nutrifyApi", (err, token)=>{
            if(!err){
                res.send({msg:"login Successfull",  token:token})
            }
           })

        }
        else{
            res.status(400).send({message:"Invalid Password"})
        }
     })

    }
    //if user{email}not exist
    else{
        res.status(404).send({message:"Invalid Email or Password"})
    }
    
   }
   catch (error) {
    res.status(500).send({msg:"internal error", error})
}

})

//all the end points must be accessed by only with a token
// todo : we require a middleware for checking token and all rest stuff
 
// creating middleware
function verifyToken(req, res , next){
    if(req.headers.authorization!==undefined){

        let token =req.headers.authorization.split(" ")[1];
        jwt.verify(token , "nutrifyApi" , (err, data)=>{
            if(!err){
                next();
            }
            else{
                res.status(401).send({message:"Invalid Token"})
            }
       
        })
    }
  else{
res.send({msg:"token is not present"})
  }
   



}


// todo: Endpoint for fetching all food
app.get("/foods",verifyToken, async(req, res)=>{
    try {
        let data=await foodmodel.find();
        res.send(data)
    } catch (error) {
        res.send({msg:"some error while fetching data" , error})
    }
    
})

//todo:-> Endpoint for fetching food by name

app.get("/foods/:name",verifyToken, async(req, res)=>{
    try {
        let data=await foodmodel.find({name:{$regex:req.params.name,$options:"i"}}); //regex is used for search all possible matches with that data $options are used for removing case sensetive
       if(data!==null) res.send(data)
        else{
    res.send({msg:"food not found"})}
    } catch (error) {
        console.log(error)
        res.send({msg:"some error while fetching data" })
    }
    
})


//todo: Endpoints for tracking food for me
// here we need to track how much user has eaten and what has he eaten?
// in tracking collectioon we find that user.model and foodmodel.model has many to many relation any user can eat any food and any food can be eat by any user

app.post("/track" ,verifyToken,async(req,res)=>{
    let trackdata=req.body;
    // check data already present?
    let data=await trackingModel.findOne({userId:trackdata.userId,foodId:trackdata.foodId ,quantity:trackdata.quantity })
    if(data!=null){
        res.send({msg:"data already present"}) // data already present
    }else{
    try {
        let data=await trackingModel.create(trackdata)
        res.status(201).send(data)
        
    } catch (error) {
        res.status(500).send({msg:"Something happen while adding data in db" , error})
    }
}
})

//Endpoint to fetch all foods eaten by a person in a day
app.get("/track/:userId/:date" , verifyToken,async(req, res)=>{
    let userId=req.params.userId;
    let date=new Date(req.params.date)
    let strDate=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    console.log(strDate);
    
    try{
        let data=await trackingModel.find({userId:userId , date:strDate}).populate('userId').populate('foodId')
        res.send(data)
    }
    catch(err){
        req.send({msg:"something happen while fetching data" , err})
    }
})






app.listen(4000, () => {
    console.log("app is running");
});

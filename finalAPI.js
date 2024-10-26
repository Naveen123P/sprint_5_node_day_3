const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config()
const {PORT, DB_PASSWORD, DB_USER} = process.env;
const app = express() 

const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.s8uvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(dbURL).then(function(connection){
    console.log(connection)
})












app.use(express.json());// to get data from user

app.use(function(req,res,next){// checklist if we are sending the empty data or not to post method
    if(req.method == "POST"){
        const userDetails = req.body;
        const isEmpty = Object.keys(userDetails).length == 0;
        if(isEmpty){
            res.status(404).json({
                status:"failure",
                message:"user Details are empty"
            })
        }else{
            next()
        }
    }else{
        next();
    }
})

/***** API's  ******/
app.get("/api/user", getAllUsers);
// to create a user
app.post("/api/user",createUserHandler);
// to get user based on id -> template route
app.get("/api/user/:userId",getUserById)

/* Handler Functions    */

function createUserHandler(req,res){
    const userDetails = req.body;

    res.status(200).json({
        status:"success",
        message:"got response from post method"
    })
}

function getUserById(req,res){
    try{
        const userId = req.params.userId;
    const userDetails = getUserByid(userId);
    if(userDetails == "no user found"){
        throw new Error(`user with ${userId} not found`)
    }else{
        res.status(200).json({
            status:"success",
            message:userDetails
        })
    }
    }catch(err){
        res.status(404).json({
            status:"failure",
            message:err.message
        })
    }
}

function getAllUsers(req,res){
    try{
     console.log("I am inside get method");
 
     if(userDataStore.length == 0){
         throw new Error("No Users Found");
     }
     res.status(200).json({
         status:"success",
         message:userDataStore
     })
    }catch(err){
         res.status(404).json({
             status:"failure",
             message:err.message
         })
    }}

/* Helper Function */

function getUserByid(id){
    const user = userDataStore.find(user=>{
        return user.id == id; 
    })
    if(user == undefined){
        return "no user found";
    }else{
        return user;
    }
}

app.use(function(req,res){
    res.status(404).json({
        status:"failure",
        message:"404 Page Not Found"
    })
})





app.listen(PORT, function(req, res){
    console.log(`Server is running at port ${PORT}`);
})
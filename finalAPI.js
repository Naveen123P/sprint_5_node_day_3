const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config()
const {PORT, DB_PASSWORD, DB_USER} = process.env;
const app = express() 

const encodedPassword = encodeURIComponent(DB_PASSWORD);

const dbURL = `mongodb+srv://${DB_USER}:${encodedPassword}@cluster0.s8uvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(dbURL).then(function(connection){
    console.log("connection success")
})

const userSchemaRules = {
    // yet need to add rules
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    conformPassword: {
        type: String,
        required: true,
        minlength: 8,
        validate: function(){
            return this.password === this.conformPassword;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


}

const userSchema = new mongoose.Schema(userSchemaRules)
// this model will have queries/ syntaxes 
const UserModel = mongoose.model("UserModel", userSchema)


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

async function createUserHandler(req,res){
    try{
        const userDetails = req.body;
        //Adding User to DB
        const user = await UserModel.create(userDetails)   
        res.status(200).json({
            status:"success",
            message:`added the user`,
            user,
        })     
    }catch(err){
        res.status(500).json({
            status:"failure",
            message:err.message
        })
    }
}

async function getUserById(req,res){
    try{
        const userId = req.params.userId;
    const userDetails = await UserModel.findById(userId);
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

async function getAllUsers(req,res){
    try{
     console.log("I am inside get method");
     const userDataStore = await UserModel.find()
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
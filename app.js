//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const encrypt = require("mongoose-encryption");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser:true});

app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({
    name: String,
    passWord: String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['passWord']});
const User = mongoose.model("User",userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        name: username,
        passWord:password
    });
    User.findOne({name:username},function(err,found){
        if(!err){
            if(found){

            }else{
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                    }
                });
                res.render("secrets");
            }
        }
    })
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    console.log(username,password);
    User.findOne({name:username},function(err,found){
        if(!err){
            if(found){
                if(found.passWord === password){
                    res.render("secrets");
                }else{
                    console.log("Password incorrect");
                }
                
            }else{
                console.log("User not found");
            }
        }
    })
})

app.listen(3000,function(){
    console.log("Started on Port 3000");
})
const SignUp = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringEmpty(str){
    if(str==undefined||str.length==0){
        return true;
    }else{
        return false;
    }
}

function generateAccessToken(id,name){
    return jwt.sign({signupId:id,name:name},'qwertyuiopasdfghjkl0987654321mnbvcxz');
}

exports.postLogin = async(req,res,next)=>{
    try{
        const email= req.body.email;
        const passward = req.body.passward;
        if(isStringEmpty(email)||isStringEmpty(passward)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const users = await SignUp.findAll({where:{email}});
        if(users.length>0){
            bcrypt.compare(passward,users[0].passward,(err,result)=>{
                if(err){
                    throw new Error("Something Went Wrong");
                }
                if(result===true){
                    return res.status(200).json({success:true,message:"Login Successfull",token:generateAccessToken(users[0].id,users[0].name)});
                }else{
                    return res.status(401).json({success:false,message:"Passward Is Incorrect"});
                }
            })  
        }else{
            return res.status(404).json({success:false,message:"User Not Found"});
        }  
    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message:err})
    }
}
const SignUp = require('../models/signup');
const bcrypt = require('bcrypt');

function isStringEmpty(str){
    if(str==undefined||str.length==0){
        return true;
    }else{
        return false;
    }
}

exports.postSignup = async(req,res,next)=>{
    try{
        const name = req.body.myname;
        const email = req.body.myemail;
        const passward = req.body.mypassward;
        const users = await SignUp.findAll();
        for(let i=0;i<users.length;i++){
            if(users[i].email==email){
                return res.status(400).json({error:"User Already Exist!"});
            }
        }
        if(isStringEmpty(name)||isStringEmpty(email)||isStringEmpty(passward)){
            return res.status(400).json({error:"All Fields Are Mandatory"});
        }
        const saltrounds=10;
        bcrypt.hash(passward,saltrounds,async(err,hash)=>{
            await SignUp.create({name:name,email:email,passward:hash});
            res.status(201).json({message:"Successfully created New User"});
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
}


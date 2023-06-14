const SignUp = require('../models/signup');

function isStringEmpty(str){
    if(str==undefined||str.length==0){
        return true;
    }else{
        return false;
    }
}

exports.postLogin = async(req,res,next)=>{
    try{
        const email = req.body.myemail;
        const passward = req.body.mypassward;
        if(isStringEmpty(email)||isStringEmpty(passward)){
            return res.status(400).json({error:"All Fields Are Mandatory"});
        }
        const users = await SignUp.findAll();
        // console.log(email,passward);
        
        for(let i=0;i<users.length;i++){
            // console.log(i,users[i]);
            if(users[i].email==email){
                if(users[i].passward==passward){
                    return res.status(200).json({error:"login Complete"});
                }else{
                    return res.status(400).json({error:"Password is incorrect"});
                }
            }
        }
        return res.status(400).json({error:"User Not Found"});
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
}
const SignUp = require('../models/signup');


exports.postSignup = async(req,res,next)=>{
    try{
        const name = req.body.myname;
        const email = req.body.myemail;
        const passward = req.body.mypassward;
        console.log(name,email,passward);
        const users = await SignUp.findAll();
        console.log(users);
        for(let i=0;i<users.length;i++){
            if(users[i].email==email){
                console.log("hii exist")
                return res.status(400).json({error:err});
            }
        }
        const data = await SignUp.create({name:name,email:email,passward:passward});
        // console.log(data);
        res.status(201).json({newExpense:data});
    }catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
}
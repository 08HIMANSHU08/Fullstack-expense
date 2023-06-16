
const SignUp = require('../models/signup');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

const Sib = require('sib-api-v3-sdk');
require('dotenv').config()
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDMAIL_KEY

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
    email:'himanshusinghpatel@gmail.com'
}

// const receivers = [
//     {
//         email:'phimanshu08@gmail.com'
//     }
// ]
// tranEmailApi  
//     .sendTransacEmail({
//         sender,
//         to:receivers,
//         subject:'forget passward',
//         TextContent: `forgetted the passward`
//     })
//     .then(console.log())
//     .catch(console.log());

// function generateAccessToken(id,name,ispremiumuser){
//     console.log("purchase",id,name,ispremiumuser)
//     return jwt.sign({signupId:id,name:name,ispremiumuser},process.env.TOKEN_SECRET);
// }

   
    exports.postForgetPassword = async(req,res,next)=>{
        // const t = await sequelize.transaction();
        try{
            const email = req.body.email;

            const users = await SignUp.findAll({where:{email}});
            console.log(users,users[0])
            if(users[0].email==email){
                const sender = {
                    email:'himanshusinghpatel@gmail.com'
                }
                const receivers = [
                    {
                        email:email
                    }
                ]
                tranEmailApi  
                    .sendTransacEmail({
                        sender,
                        to:receivers,
                        subject:'forget passward',
                        TextContent: "Change your passward"
                    })
                    .then(console.log())
                    .catch(console.log());
            }
        }catch(err){
            // await t.rollback();
            console.log(err);
            res.status(500).json({message:err,success:false})
        }
    }
    
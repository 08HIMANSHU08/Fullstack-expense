
const SignUp = require('../models/signup');
const ForgotPassward = require('../models/forgetpasswardrequest');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../util/database');
const {v4:uuidv4} = require('uuid');

const Sib = require('sib-api-v3-sdk');
require('dotenv').config()
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDMAIL_KEY

const uuid = uuidv4();
const tranEmailApi = new Sib.TransactionalEmailsApi();
   
    exports.postForgetPassword = async(req,res,next)=>{
        // const t = await sequelize.transaction();
        // console.log("kcjewhfkj")
        try{
            const email = req.body.email;
            // console.log(email,"enmfefhiuewyhiufyegf")
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
                await tranEmailApi  
                    .sendTransacEmail({
                        sender,
                        to:receivers,
                        subject:'Reset Your Passward',
                        TextContent: `http://localhost:3000/password/resetpassword/${uuid}`
                    })
                // await t.commit();

                await ForgotPassward.create({id:uuid,isactive:true,signupId:users[0].id});
                // console.log("request send");
                return res.status(200).json({message:"Clear",success:true});
            }
        }catch(err){
            // await t.rollback();
            console.log("err");
            res.status(500).json({message:err,success:false})
        }
    }
    
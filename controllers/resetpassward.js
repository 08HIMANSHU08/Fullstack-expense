const Expense = require('../models/expensetable');
const ForgotPassward = require('../models/forgetpasswardrequest');
const SignUp = require('../models/signup');
const sequelize = require('../util/database');
const bcrypt = require('bcrypt');

exports.getResetpassward = async(req,res,next)=>{
    try{
        const uuid = req.params.uuid;
        const user= await ForgotPassward.findByPk(uuid);
        // console.log("csw")
        
        console.log(user.id==uuid);
        if(user.id==uuid &&user.isactive==true){
            // await ForgotPassward.update({isactive: false},{where:{id:uuid}});
            console.log("forgotpass isactive false")
                res.status(200).send(`<html>
                                            <script>
                                                function formsubmitted(e){
                                                    e.preventDefault();
                                                    console.log('called')
                                                }
                                            </script>

                                            <form action="/password/updatepassword/${uuid}" method="get">
                                                <label for="newpassword">Enter New password</label>
                                                <input name="newpassword" type="password" required></input>
                                                <button>reset password</button>
                                            </form>
                                        </html>`
                                        )
                                res.end()
            }
        }
        catch{
            console.log("Err");
        }
}

exports.updatePassward = async(req, res,next) => {

        try {
            const { newpassword } = req.query;
            const { resetpasswordid } = req.params;
            // console.log("newpassward",newpassword);
            // console.log("resetpasswordid",resetpasswordid);
            const forgot = await ForgotPassward.findByPk(resetpasswordid);
            // console.log(forgot.signupId);
            const signup = await SignUp.findByPk(forgot.signupId)
            // console.log("forgot",signup.id);
            if(signup){

            const saltRounds = 10;
           
             bcrypt.hash(newpassword, saltRounds, async function(err, hash) {
                console.log(newpassword,hash)
                await SignUp.update({ passward: hash },{where:{id:signup.id}})
                    res.status(201).json({message: 'Successfuly update the new password'})
            })
            } 
            else{
            return res.status(404).json({ error: 'No user Exists', success: false})
            }
        } catch(error){
            return res.status(403).json({ error, success: false } )
        }

}

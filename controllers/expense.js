
const Expense = require('../models/expensetable');
const SignUp = require('../models/signup');

exports.getExpense = async(req,res,next)=>{
    try{
        const users = await Expense.findAll({where:{signupId:req.signup.id}});
        // console.log(users);

        res.status(200).json({allExpense:users});
    }catch(err){
        console.log('get user is failed',JSON.stringify(err))
        res.status(500).json({error:err})
    }
}

exports.postExpense = async(req,res,next)=>{
    try{
        const expense = req.body.exp;
        const category = req.body.cat;
        const description = req.body.desc;
        const data = await Expense.create({amount:expense,description:description,category:category,signupId:req.signup.id});
        console.log(data);
        const totalexp = Number(req.signup.totalexpense) + Number(expense);
        await SignUp.update({totalexpense:totalexp},{where:{id:req.signup.id}});
        res.status(201).json({newExpense:data});
    }catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
        if(req.params.id == 'undefined'){
            console.log("ID is Missing");
            return res.status(400).json({err:"ID is Missing"})
        }
        const userId = req.params.id;
        const expdata = await Expense.findByPk(userId);
        const totalexp = Number(req.signup.totalexpense) - Number(expdata.amount);
        await Expense.destroy({where:{id:userId,signupId:req.signup.id}});
        await SignUp.update({totalexpense:totalexp},{where:{id:req.signup.id}});
        res.status(200)
    }
    catch(err){
        res.status(500).json({error:err})
    }
}

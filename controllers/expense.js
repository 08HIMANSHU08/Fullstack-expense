
const Expense = require('../models/expensetable');

exports.getExpense = async(req,res,next)=>{
    try{
        const users = await Expense.findAll();
        console.log(users);
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
        const data = await Expense.create({amount:expense,description:description,category:category});
        console.log(data);
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
        await Expense.destroy({where:{id:userId}});
        res.status(200)
    }
    catch(err){
        res.status(500).json({error:err})
    }
}


const Expense = require('../models/expensetable');
const SignUp = require('../models/signup');
const sequelize = require('../util/database');

exports.getLeaderBoard = async(req,res,next)=>{
    try{
        // console.log("check");
        const userAggregatedExpense = await SignUp.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_expense']],
            include:[
                {
                model:Expense,
                attributes:[]
                }
            ],
            group:['signup.id'],
            order:[['total_expense','DESC']],
         });
         console.log("sdmhfgkjdfghdfkjhyerkjtghery",userAggregatedExpense);
         res.status(200).json(userAggregatedExpense);
        // const userAggregatedExpense = await Expense.findAll({
        //     attributes:['signupId',[sequelize.fn('sum',sequelize.col('amount')),'total_expense']],
        //     group:['signupId']
        // });
        // const userAggregatedExpense = {}
        // expenses.forEach((expense) => {
        //     // console.log(expense.amount);
        //     if(userAggregatedExpense[expense.signupId]){
        //         userAggregatedExpense[expense.signupId] += expense.amount;
        //     }else{
        //             userAggregatedExpense[expense.signupId] = expense.amount;
        //     } 
        // });
        // console.log("sdmhfgkjdfghdfkjhyerkjtghery",userAggregatedExpense);
        // let userleaderBoardDetails = [];
        // signup.forEach((sign)=>{
        //     userleaderBoardDetails.push({name:sign.name,total_expense:userAggregatedExpense[sign.id]||0})
        // })
        // console.log("sdmhfgkjdfghdfkjhyerkjtghery",userleaderBoardDetails);
        // userleaderBoardDetails.sort((a,b)=>b.total_expense-a.total_expense);
        
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}


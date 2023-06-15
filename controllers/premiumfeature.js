
const Expense = require('../models/expensetable');
const SignUp = require('../models/signup');
const sequelize = require('../util/database');

exports.getLeaderBoard = async(req,res,next)=>{
    try{
        // console.log("check");
        const signup = await SignUp.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpense = {}
        expenses.forEach((expense) => {
            // console.log(expense.amount);
            if(userAggregatedExpense[expense.signupId]){
                userAggregatedExpense[expense.signupId] += expense.amount;
            }else{
                    userAggregatedExpense[expense.signupId] = expense.amount;
            } 
        });
        let userleaderBoardDetails = [];
        signup.forEach((sign)=>{
            userleaderBoardDetails.push({name:sign.name,total_expense:userAggregatedExpense[sign.id]||0})
        })
        console.log(userleaderBoardDetails);
        userleaderBoardDetails.sort((a,b)=>b.total_expense-a.total_expense);
        res.status(200).json(userleaderBoardDetails);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}


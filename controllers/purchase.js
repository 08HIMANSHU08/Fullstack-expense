
const RazorPay = require('razorpay');
const Order = require('../models/order');

exports.getPurchase = async(req,res,next)=>{
    try{
        var raz = new RazorPay({
            key_id:'rzp_test_rzkc78bHD4hoGK',
            key_secret:'b6Z5z2lx7eEW7d3bmCBmur7L',
        })
        const amount = 25000;
        raz.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                // throw new Error(JSON.stringify(err));
                console.log("err")
            }
            Order.create({orderid:order.id,status:"PENDING"})
            .then(()=>{
                return res.status(201).json({order,key_id:raz.key_id});
            })
            .catch(err=>{console.log(err)})
        })
    }catch(err){
        console.log(err);
        res.status(403).json({message:'Something Went Wrong',error:err});
    }
}

exports.postPurchase = async(req,res,next)=>{
    try{
        const {payment_id,order_id}=req.body;
        console.log(req.body);
        Order.findOne({where:{orderid:order_id}})
        .then(order=>{
            order.update({paymentid:payment_id,status:"SUCCESSFULL"})
            .then(()=>{
                req.signup.update({ispremiumuser:true})
                .then(()=>{
                    return res.status(202).json({success:true,message:"Transaction Successfull"});
                }).catch((err)=>{console.log(err)});
            }).catch((err)=>{console.log(err)});
        }).catch((err)=>{console.log(err)});
    }
    catch(err){
        res.status(500).json({error:err});
    }
}
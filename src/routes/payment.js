const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const membershipAmount = require("../utils/constants")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');


paymentRouter.post("/payment/create",userAuth,async(req, res)=>{
    try{
        console.log(req.body)
        const {membershipType} = req.body;
        console.log(membershipType)
        const {firstName, lastName, emailId} = req.user;

        var options = {
            amount: membershipAmount[membershipType] * 100 ,  // Amount is in currency subunits. (PAISA)
            currency: "INR",
            receipt: "order_rcptid_11",
            notes: {
                firstName,
                lastName,
                emailId,
                membershipType : membershipType
            }
        };
        console.log(options);          
       const order = await razorpayInstance.orders.create(options)

       //save it in the database
       const payment = new Payment({
           userId: req.user._id,
           orderId: order.id,
           amount: order.amount,
           currency: order.currency,
           status: order.status,
           receipt: order.receipt,
           notes: order.notes
       });
       const savedPayment = await payment.save();

       //return back my order details to the front end
       res.json({...savedPayment.toJSON(), keyId : process.env.RAZORPAY_KEY_ID})

    }catch(err){
    console.log("FULL ERROR =>", err);

    res.status(400).json({
        error: err,
        message: err?.message
    });
}

})

paymentRouter.post("/payment/webhook", async(req, res)=>{
    try{

        const webhookSignature = req.get("x-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
          process.env.RAZORPAY_WEBHOOK_SECRET)

          if(!isWebhookValid){
            res.status(400).json({message : "Webhook signature is invalid"})
          }

          // Update payment status in DB
            const paymentDetails = req.body.payload.payment.entity;
            const payment = await Payment.findOne({orderId : paymentDetails.order_id});
            payment.status = paymentDetails.status;
            await payment.save();

          // Update the user as premium
            const user = await User.findOne({_id : payment.userId});
            user.isPremium = true;
            user.membershipType = payment.notes.membershipType;
            await user.save();
        


        //   if(req.body.event == "payment.captured"){
        //   }

        //   if(req.body.event == "payment.failed"){
        //   }


          // return success to razorpay 
          res.status(200).json({message : "webhook received successfully!"})

    }catch(err){
       console.log(err);
    }
})

module.exports = {
    paymentRouter
}
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
        console.log("payment route hit!")
        console.log(req.body)
        const {membershipType} = req.body;
        // console.log(membershipType)
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


paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    console.log(req.body)
    console.log(webhookSignature)

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await user.save();

    // Update the user as premium

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});



paymentRouter.get("/premium/verify", userAuth, async(req, res)=>{
    try{
        const user = req.user.toJSON();
        if(user.isPremium){
            return res.json({isPremium : true, user})
    }
    return res.json({isPremium : false})
  }catch(err){
    console.log(err);
    return res.status(500).json({message : err.message});
  }
})

module.exports = {
  paymentRouter
}

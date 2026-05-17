const cron = require("node-cron");
const connectionRequest = require("../models/connectionRequest");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const sendEmail = require("../utils/sendEmail");
// this job will run at 8 AM in the morning everyday
cron.schedule("0 8 * * *", async()=>{
    try{
        const yesterday = subDays(new Date() , 1)
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequests = await connectionRequest.find({
            status : "interested",
            createdAt: {
                $gte : yesterdayStart,
                $lt : yesterdayEnd

            }
        }).populate("fromUserId toUserId")
        console.log(pendingRequests)

        const listOfEmails = [...pendingRequests.map((req)=>req.toUserId.emailId)]
        // console.log(listOfEmails)
        for(const emails of listOfEmails){
            // Send Emails
            try{
                const res = await sendEmail.run("New friend requests pending for " + emails ,"You have friend requests pending from yesterday!, please login to devtinder to review the requests " )
            }catch(err){
                console.error(err)
            }

        }
    }catch(err){
        console.error(err);
    }
});


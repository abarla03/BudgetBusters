const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const sgMail = require('@sendgrid/mail')


// const admin= require("firebase-admin");
// const serviceAccount = require("../BE/src/main/resources/serviceAccountKey.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     // Other configurations...
// });


/************************************************ TWILIO INFORMATION **************************************************/


const functions = require('firebase-functions');
const accountSid = 'AC138105b62973480f995122e6f05f5bbe';
const authToken = '82911cf661dc103e7b8dcaf14c056f1a';
const client = require('twilio')(accountSid, authToken);

const API_KEY = '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';


sgMail.setApiKey(API_KEY);


// Function to send the "Daily Spending" email
function sendDailyInputPurchase() {
    console.log("sendDailyInputPurchase email function called!");
    const message = {
        to: ['a29diti@gmail.com', 'spushpa@purdue.edu', 'shreybar@gmail.com', 'angela.joseph.r@gmail.com'],
        from: 'aditibar03@gmail.com',
        subject: 'Input Daily Spending',
        text: 'Hello, its time to input your daily spending!',
        html: '<h1>It is time to input your daily spending!</h1>',
    };

    return sgMail.send(message);
}

// const dailySpendingRecipients = ['a29diti@gmail.com', 'spushpa@purdue.edu', 'shreybar@gmail.com', 'angela.joseph.r@gmail.com'];
// Scheduled function to send "Daily Spending" email every 5 minutes
exports.scheduleDailySpendingEmail = functions.pubsub.schedule('every day 09:26').timeZone('America/New_York').onRun((context) => {
    return sendDailyInputPurchase()
        .then((response) => console.log('Daily Spending Email sent...', response))
        .catch((error) => console.error('Error sending Daily Spending Email:', error.message));


     // return null;
});


// Function to set monthly email
function sendMonthlyGoalsEmail() {
    console.log("sendMonthlyGoalsEmail function called!");
    //console.log(`recipients: ${recipients}`);
    const message = {
        to: ['a29diti@gmail.com', 'spushpa@purdue.edu', 'shreybar@gmail.com', 'angela.joseph.r@gmail.com'],
        from: 'aditibar03@gmail.com',
        subject: 'Set Monthly Goals',
        text: 'Hello, its time to set your monthly goals!',
        html: '<h1>“It’s a new month! Time to fill in your budget goal and spending categories</h1>',
    };
    return sgMail.send(message);
}
module.exports = sendMonthlyGoalsEmail();




// Function for percent threshold
function warningEmail(recipients) {
    const message = {
        to: ['a29diti@gmail.com', 'spushpa@purdue.edu', 'shreybar@gmail.com', 'angela.joseph.r@gmail.com'],
        from: 'aditibar03@gmail.com',
        subject: 'Budget Warning',
        text: 'Uh oh. You are hitting your budget threshold for this month.',
        html: '<h1>Uh oh. You are hitting your budget threshold for this month</h1>',
    };
    return sgMail.send(message);
}


//Function to send SMS
exports.sendSMS = (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: '+18778125764',
        to: phoneNumber
    });
};


/******************************************** HARDCODED SEND SMS NOTIFS ***********************************************/


let textUsers = ['+12247049742', '+14256069675', '12244094088', '5157455998'];
// exports.dailyNotification = functions.pubsub.schedule('every day 08:10').timeZone('America/Chicago').onRun((context) => {
//     console.log("exports.dailyNotification function called!");
//
//     textUsers.forEach(item => {
//         const phoneNumber = item;
//         const message = 'Reminder! Input your daily spending for today! (BudgetBusters)';
//         return exports.sendSMS(phoneNumber, message)
//             .then(() => {
//                 console.log('Daily notification sent!');
//                 //return null;
//             })
//             .catch((error) => {
//                 console.error('Error sending daily notification:', error);
//                 //return null;
//             });
//     });
// });

exports.dailyNotification = functions.pubsub.schedule('every day 09:26').timeZone('America/Chicago').onRun((context) => {
    console.log("exports.dailyNotification function called!");

    const smsPromises = textUsers.map(item => {
        const phoneNumber = item;
        const message = 'Reminder! Input your daily spending for today! (BudgetBusters)';
        return exports.sendSMS(phoneNumber, message)
            .then(() => {
                console.log('Daily notification sent!');
            })
            .catch((error) => {
                console.error('Error sending daily notification:', error);
            });
    });

    return Promise.all(smsPromises);
});





/* MONTHLY SET BUDGET GOAL NOTIFICATION -- TO BE CALLED BY TIMER FUNCTION*/
const sendMonthlyNotif = () => {
    textUsers.forEach(item => {
        const phoneNumber = item;
        const message = 'It`s a new month! Time to set up your monthly budget goal!';
        return exports.sendSMS(phoneNumber, message)
            .then(() => {
                console.log('Monthly notification sent!');
                return null;
            })
            .catch((error) => {
                console.error('Error sending monthly notification:', error);
                return null;
            });
    });
};
module.exports = sendMonthlyNotif;


// /*
// sendDailyInputPurchase(dailySpendingRecipients, send_at_timestamp)
//     .then((response) => console.log('Daily Spending Email sent...', response))
//     .catch((error) => console.error('Error sending Daily Spending Email:', error.message));
// */
//
// sendMonthlyGoalsEmail(dailySpendingRecipients)
//     .then((response) => console.log('Daily Spending Email sent...', response))
//     .catch((error) => console.error('Error sending Daily Spending Email:', error.message));
//
// warningEmail(dailySpendingRecipients)
//     .then((response) => console.log('Daily Spending Email sent...', response))
//     .catch((error) => console.error('Error sending Daily Spending Email:', error.message));




/*********************************************** BUDGET WARNING NOTIF *************************************************/




// export const sendBudgetWarningNotif = (userPhoneNum) => {
//     const phoneNumber = userPhoneNum;
//     const message = 'Be careful! You`ve hit your percentage threshold for your budget!';
//
//     return exports.sendSMS(phoneNumber, message)
//         .then(() => {
//             console.log('budget warning notification sent!');
//             return null;
//         })
//         .catch((error) => {
//             console.error('Error sending budget warning notification:', error);
//             return null;
//         });
// };




//export default sendMonthlyNotif();


























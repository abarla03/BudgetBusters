// /* eslint-disable */
// // Your code here
//
// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */
//
// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
//
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });
//
// /**************TWILIO CREDENTIALS********************/
// /*
//     accountSid: ACca47d28d925dd91522c66a91292a6e0b
//     authToken: b93158b11684a1fbc8727089363a3062
//     phoneNum: +18447633905
//  */
// /**************TWILIO CREDENTIALS********************/
//
// const functions = require('firebase-functions');
// const accountSid = 'ACca47d28d925dd91522c66a91292a6e0b';
// const authToken = 'b93158b11684a1fbc8727089363a3062';
// const client = require('twilio')(accountSid, authToken);
//
// // Function to send SMS
// exports.sendSMS = (phoneNumber, message) => {
//     return client.messages.create({
//         body: message,
//         from: '+18447633905',
//         to: phoneNumber
//     });
// };
//
// // USE NOTIFICATIONS.JAVA for getting backend user info
//
// // Scheduled function to send daily notifications
// exports.dailyNotification = functions.pubsub.schedule('every day 08:00').timeZone('America/New_York').onRun((context) => {
//     const phoneNumber = '+12247049742';
//     const message = 'Your daily notification message';
//
//     return exports.sendSMS(phoneNumber, message)
//         .then(() => {
//             console.log('Daily notification sent!');
//             return null;
//         })
//         .catch((error) => {
//             console.error('Error sending daily notification:', error);
//             return null;
//         });
// });
//
// // Scheduled function to send setMonthlyGoal (monthly) notifications
// exports.monthlyNotification = functions.pubsub.schedule('every month 08:00').timeZone('America/New_York').onRun((context) => {
//     const phoneNumber = '+12247049742';
//     const message = 'Your monthly notification message';
//
//     return exports.sendSMS(phoneNumber, message)
//         .then(() => {
//             console.log('monthly notification sent!');
//             return null;
//         })
//         .catch((error) => {
//             console.error('Error sending monthly notification:', error);
//             return null;
//         });
// });
//
//
// /*
//
// function to send budgetWarning {
//
// }
//
// */
//
// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */
//

import ManageNotifications from "../src/components/ManageNotifications";
import {user} from "firebase-functions/v1/auth";



const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


/**************TWILIO CREDENTIALS********************/
/*
    accountSid: ACca47d28d925dd91522c66a91292a6e0b
    authToken: b93158b11684a1fbc8727089363a3062
    phoneNum: +18447633905
 */
/**************TWILIO CREDENTIALS********************/

const functions = require('firebase-functions');
const accountSid = 'ACca47d28d925dd91522c66a91292a6e0b';
const authToken = 'b93158b11684a1fbc8727089363a3062';
const client = require('twilio')(accountSid, authToken);

//Function to send SMS
exports.sendSMS = (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: '+18447633905',
        to: phoneNumber
    });
};

// * USE NOTIFICATIONS.JAVA for getting backend user info
// * logic for users to enter verification code?? or just I add our team's numbers so it's already verified

/*********************************************list of numbers to send daily notif**************************************/
// HARDCODED FOR NOW
// based on if users chose text as a preferred notif method
// Creating an array of strings
let textUsers = ['+12247049742', '+12247049741', '+14256069675'];

// NON-HARDCODED SEND TO WHICH USERS LOGIC
/*
 * create a global list/array of users that want text notifications, value is phone number
 *      ex: textNotifUsers =  ['+1234567890', '+1345678901', '+1456789012', '+1567890123', '+1678901234']
 * implement existing logic --> textNotifUsers.forEach
 *
 * once users choose their notification method, in addition to adding that method to backend, push user's number to list
 *      (modify as needed, ex: if they edit their preferred method to remove text, remove that number from list)
 */

/* DAILY INPUT SPENDING NOTIFICATION */
//
//Using forEach method
// textUsers.forEach(item => {
//     console.log(item);
// });
//
// // Scheduled function to send daily notifications (hardcoded singular number)
exports.dailyNotification = functions.pubsub.schedule('every day 12:10').timeZone('America/Chicago').onRun((context) => {

    textUsers.forEach(item => {
        console.log(item);
        const phoneNumber = item;
        const message = 'Reminder! Input your daily spending for today!';

        return exports.sendSMS(phoneNumber, message)
            .then(() => {
                console.log('Daily notification sent!');
                return null;
            })
            .catch((error) => {
                console.error('Error sending daily notification:', error);
                return null;
            });
    });

});

/* MONTHLY SET BUDGET GOAL NOTIFICATION */
exports.monthlyNotification = functions.pubsub.schedule('every day 15:33').timeZone('America/Chicago').onRun((context) => {

    textUsers.forEach(item => {
        console.log(item);
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

});

/* BUDGET GOAL PERCENTAGE THRESHOLD WARNING NOTIFICATION */

/*
 * BACKEND LOGIC FOR CALCULATING PERCENTAGE THRESHOLD AND WHETHER IT'S BEEN CROSSED
 *
 * dollarThreshold = (percentageThreshold * monthlyBudgetGoal) / 100
 * once the user inputs their daily spending:
       * update currentSpending
       * do a check
            * if (currentSpending >= dollarThreshold) {
                // send notif to user
 */
//exports.budgetThresholdWarningNotification = functions.

export const sendBudgetWarningNotif = (userPhoneNum) => {
    const phoneNumber = userPhoneNum;
    const message = 'Be careful! You`ve hit your percentage threshold for your budget!';

    return exports.sendSMS(phoneNumber, message)
        .then(() => {
            console.log('budget warning notification sent!');
            return null;
        })
        .catch((error) => {
            console.error('Error sending budget warning notification:', error);
            return null;
        });
};






/* function sending text notifications */
function SendTextNotifications({ notifObj }) {
    console.log("notifObj preferred method(s)", notifObj.preferredMethod);

}



//
//
// // Scheduled function to send daily notifications (hardcoded singular number)
// exports.dailyNotification = functions.pubsub.schedule('every day 11:50').timeZone('America/Chicago').onRun((context) => {
//
//     const phoneNumber1 = '+12247049742';
//     const message = 'Your daily notification message';
//
//     return exports.sendSMS(phoneNumber1, message)
//         .then(() => {
//             console.log('Daily notification sent!');
//             return null;
//         })
//         .catch((error) => {
//             console.error('Error sending daily notification:', error);
//             return null;
//         });
// });
//
// Scheduled function to send daily notifications (hardcoded singular number)
// exports.dailyNotification = functions.pubsub.schedule('every day 12:00').timeZone('America/Chicago').onRun((context) => {
//
//     const phoneNumber1 = '+12247049742';
//     const phoneNumber2 = '+14256069675';
//     const message = 'Your daily notification message';
//
//     const sendSMS = (phoneNumber, message) => {
//         return client.messages.create({
//             body: message,
//             from: '+18447633905',
//             to: phoneNumber
//         });
//     };
//
//     // Sending SMS to the first phone number
//     const sms1Promise = sendSMS(phoneNumber1, message);
//
//     // Sending SMS to the second phone number
//     const sms2Promise = sendSMS(phoneNumber2, message);
//
//     return Promise.all([sms1Promise, sms2Promise])
//         .then(() => {
//             console.log('Daily notifications sent to both numbers!');
//             return null;
//         })
//         .catch((error) => {
//             console.error('Error sending daily notifications:', error);
//             return null;
//         });
//
//
// });
//






/* eslint-disable */
// Your code here

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

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

// Function to send SMS
exports.sendSMS = (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: '+18447633905',
        to: phoneNumber
    });
};

// Scheduled function to send daily notifications
exports.dailyNotification = functions.pubsub.schedule('every day 08:00').timeZone('America/New_York').onRun((context) => {
    const phoneNumber = '+12247049742';
    const message = 'Your daily notification message';

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


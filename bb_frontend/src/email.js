const sgMail = require('@sendgrid/mail')

const API_KEY = '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';

sgMail.setApiKey(API_KEY);

const message = {
    to: 'a29diti@gmail.com',
    from: 'aditibar03@gmail.com',
    subject: 'Hello from sendgrid',
    text: 'Hello from sendgrid',
    html: '<h1>Hello from sendgrid</h1>',
};

sgMail
    .send(message)
    .then((response) => console.log('Email sent...'))
    .catch((error) => console.log(error.message) );
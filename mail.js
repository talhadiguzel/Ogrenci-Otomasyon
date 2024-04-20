const express = require("express");
const pool = require("./db");
const nodemailer = require('nodemailer');
const cron = require('node-cron');
var request = require('request');
require('dotenv').config();

// Periyot değişkenini .env dosyasından al
const period = process.env.period;
const gmail = process.env.gmail_admin
const gmail_pass = process.env.gmail_password
// Haftalık yedekleme işlemi

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmail,
        pass: gmail_pass
    }
});

var mailOptions = {
    from: 'testproje46@gmail.com',
    to: 'furkankazimc@gmail.com',
    subject: 'Weekly Student List Backup',
    text: 'Attached is the weekly backup of student list.',
    attachments: [{
        filename: 'ogrenciList.json',
        path: './ogrenciList.json'
    }]
};

function sendEmail() {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = {
    sendEmail
}

cron.schedule(period, () => {
    console.log('Running weekly backup...');
    request.post('http://localhost:3000/ogrenci/save', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Cronjob successfully worked.")
        }
        else {
            console.log("In cronjob call to /ogrenci/save failed", error);
        }
    });
});

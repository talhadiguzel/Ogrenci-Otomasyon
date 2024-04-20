const express = require("express");
const router = express.Router();
const pool = require("./db");

const fs = require('fs');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

// Periyot değişkenini .env dosyasından al
const period = process.env.period;

// Haftalık yedekleme işlemi
const weeklycheck = (req, res) => {
      // Tüm öğrenci kayıtlarını getiren sorgu
  const query = "SELECT * FROM ogrenci";
  pool.query(query, (err, result) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      if (result.rows.length === 0){
        res.status(500).send({message: "Ogrenci kaydi bulunamadi."})
      }else{
        res.status(200).send({ message: 'Öğrenci bilgileri başarıyla cekildi', result: result.rows});
        fs.writeFileSync('ogrenciList.json', JSON.stringify(result.rows));
      }
    }
  })

    

    // E-posta gönderme işlemi
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'talhadiguzel@gmail.com',
            pass: process.env.gmail_password
        }
    });

    const mailOptions = {
        from: 'talhadiguzel@gmail.com',
        to: 'talhadiguzel@gmail.com',
        subject: 'Weekly Student List Backup',
        text: 'Attached is the weekly backup of student list.',
        attachments: [{
            filename: 'ogrenciList.json',
            path: './ogrenciList.json'
        }]
    };

    sendMail(mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Haftalık yedekleme işlemini ve e-posta gönderimini periyodik olarak çalıştır
cron.schedule(`0 0 * * ${period}`, () => {
    console.log('Running weekly backup...');
    weeklycheck();
});
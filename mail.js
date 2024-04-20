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
const sendMail = (mailOptions) => {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'talhadiguzel@gmail.com',
          pass: process.env.gmail_password
      }
  });

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error occurred while sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};

const weeklycheck = () => {
  // Tüm öğrenci kayıtlarını getiren sorgu
  const query = "SELECT * FROM ogrenci";
  pool.query(query, (err, result) => {
      if (err) {
          console.error("Öğrenci bilgileri çekilirken bir hata oluştu:", err);
      } else {
          if (result.rows.length === 0) {
              console.error("Ogrenci kaydi bulunamadi.");
          } else {
              console.log('Öğrenci bilgileri başarıyla çekildi');
              fs.writeFileSync('ogrenciList.json', JSON.stringify(result.rows));
              const mailOptions = {
                  from: 'talhadiguzel@gmail.com',
                  to: 'furkankazimc@gmail.com',
                  subject: 'Weekly Student List Backup',
                  text: 'Attached is the weekly backup of student list.',
                  attachments: [{
                      filename: 'ogrenciList.json',
                      path: './ogrenciList.json'
                  }]
              };
              sendMail(mailOptions);
          }
      }
  });
};

// Haftalık yedekleme işlemini ve e-posta gönderimini periyodik olarak çalıştır
cron.schedule(`*/1 * * * *`, () => {
  console.log('Running weekly backup...');
  weeklycheck();
});
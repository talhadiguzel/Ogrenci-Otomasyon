const express = require("express");
const router = express.Router();
const pool = require("./db");// Veritabanı bağlantısı için db dosyası çağrılır

router.get("/",   (req, res) => {
    // Tüm bölüm kayıtlarını getiren sorgu
    const query = "SELECT * FROM bolum";
    pool.query(query, (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      }
      else {
        if (result.rows.length === 0){
          res.status(500).send({message: "Bolum kaydi bulunamadi."})
        }
        else{
          res.status(200).send({ message: 'Bölüm bilgileri başarıyla cekildi', result: result.rows});
        }
      }
    });
  });


// Belirli bir bolum id'sine sahip bölümü
router.get("/:id", async (req, res) => {
    const dept_std_id = req.params.id;
    const query = `SELECT * FROM bolum`;
    pool.query(query, [dept_std_id], (err, result) => {
        if (err) {
        res.status(500).send(err.message);
        } else {
            if (result.rows.length === 0){
                // departmanda bulunmamasi durumu
                res.status(500).send({message: "kaydi bulunamadi."})
              }else{
                res.status(200).send({ message: 'Bilgileri başarıyla cekildi', result: result.rows});
              }
        }
    });

});

// Yeni bölüm
router.post('/add', (req, res) => {
    //bodyden alincaklar
    const { name } = req.body;
    //queryde yazan seyin aynisi bodyde, nodejs icinde direkt parse ediliyor
    //yeni bolum ekleme komutu
    const query = `INSERT INTO bolum (name) VALUES ($1)`;
    pool.query(query, [name], (err, result) => {
        if (err) {
        res.status(500).send(err.message);
        } else {//201 Created
        res.status(201).send({ message: 'Bölüm başarıyla eklendi' });
        }
    });
});

// Belirli bir bölümü silme
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;// URL'den gelen bölüm id

    //silme sorgusu
    const query = `DELETE FROM bolum WHERE id = $1`;
    pool.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send({ message: 'Bölüm başarıyla silindi' });
      }
    });
  });

  module.exports = router;
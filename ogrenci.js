const express = require("express");
const router = express.Router();
const pool = require("./db");// Veritabanı bağlantısı için db dosyası çağrılır


//tum ogrenci bilgieri cekiliyor
router.get("/",   (req, res) => {
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
      }
    }
  });
});


// Belirli bir öğrenciyi getir
router.get("/:id",  (req, res) => {
    const { id } = req.params;//urlden gelen parametre
    const query = "SELECT * FROM ogrenci WHERE id = $1"
    pool.query(query, [id], (err, result) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          if (result.rows.length === 0){
            //ogrenci yoksa
            res.status(500).send({message: "Ogrenci kaydi bulunamadi."})
          }else{
            res.status(200).send({ message: 'Öğrenci bilgileri başarıyla cekildi', result: result.rows});
          }
        }
      });
    });

//ogrenci ekleme
router.post("/add", (req, res) => {
  const { name, email, dept_id } = req.body;

  // Öncelikle veritabanında aynı dept_id'ye sahip öğrenci olup olmadığını kontrol ediyoruz
  const checkQuery = `SELECT COUNT(*) FROM ogrenci WHERE dept_id = $1`;

  pool.query(checkQuery, [dept_id], (err, result) => {
      if (err) {
          res.status(500).send(err.message);
      } else {
          const existingCount = parseInt(result.rows[0].count);
          if (existingCount > 0) {
              res.status(400).send({ error: 'Bu bölüme ait öğrenci zaten var.' });
          } else {
              // Eğer aynı bölüme ait öğrenci yoksa ekleme işlemine devam ediyoruz
              const insertQuery = `INSERT INTO ogrenci (name, email, dept_id) VALUES ($1, $2, $3)`;
              pool.query(insertQuery, [name, email, dept_id], (insertErr, insertResult) => {
                  if (insertErr) {
                      if (insertErr.code === '23505' || insertErr.code === '23503') {
                          res.status(500).send({ error: 'Bağlantılı bir kayıt bulunduğu için güncelleme yapılamadı.' });
                      } else {
                          res.status(500).send(insertErr.message);
                      }
                  } else {
                      res.status(201).send({ message: 'Öğrenci başarıyla eklendi' });
                      addcounter().then(() => {
                        console.log("Öğrenci sayacı artırıldı.");
                    }).catch((error) => {
                        console.error("Öğrenci sayacı güncellenirken bir hata oluştu:", error);
                    });
                  }
              });
          }
      }
  });
});


// Öğrenci güncelleme
router.put("/update/:id",   (req, res) => {
  const id = req.params.id;//urlden gelen parametre
  const { name, email, dept_id } = req.body;
  const query = `UPDATE ogrenci SET name = $1, email = $2, dept_id = $3 WHERE id = $4`;
  pool.query(query, [name, email, dept_id, id], (err, result) => {
    if (err) {
      if (err.code === '23505' || err.code === '23503') {
        res.status(500).send({ error: 'Bağlantılı bir kayıt bulunduğu için güncelleme yapılamadı.' });
      } else {
        res.status(500).send(err.message);
      }
    } else {
      res.status(200).send({ message: 'Öğrenci başarıyla güncellendi' });
    }
  });
});

// Öğrenci silme
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;//urlden gelen parametre
    const query = `DELETE FROM ogrenci WHERE id = $1`;
    pool.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send({ message: 'Öğrenci başarıyla silindi' });
        delcounter().then(() => {
          console.log("Öğrenci sayacı azaltıldı.");
      }).catch((error) => {
          console.error("Öğrenci sayacı güncellenirken bir hata oluştu:", error);
      });
      }
    });
  });

// Öğrenci sayaç değerini getirme


// Sayacı artırma fonksiyonu
const addcounter = async () => {
  try {
    const query = `UPDATE counter SET coun = coun + 1`;
    await pool.query(query);
    const result = await pool.query(`SELECT coun FROM counter`);
    const coun = result.rows[0].coun;
    console.log("Öğrenci sayacı:" + coun);
  } catch (error) {
    console.error("Öğrenci sayacı güncellenirken bir hata oluştu:", error);
  }
};

const delcounter = async () => {
  try {
    const query = `UPDATE counter SET coun = coun - 1`;
    await pool.query(query);
    const result = await pool.query(`SELECT coun FROM counter`);
    const coun = result.rows[0].coun;
    console.log("Öğrenci sayacı:" + coun);
  } catch (error) {
    console.error("Öğrenci sayacı güncellenirken bir hata oluştu:", error);
  }
};


module.exports = router;
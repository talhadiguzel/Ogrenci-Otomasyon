const express = require("express");
const router = express.Router();
const pool = require("./db"); // Veritabanı bağlantısı için db dosyası çağrılır

router.get("/", async (req, res) => {
    try {
        const query = `SELECT coun FROM counter`;
        const result = await pool.query(query);
        
        if (result.rows.length > 0) {
            const counterValue = result.rows[0].coun; // 'sayac' sütununu alıyoruz
            res.status(200).send({ message: 'Öğrenci sayac değeri başarıyla getirildi', result: counterValue });
        } else {
            res.status(404).send({ message: 'Öğrenci sayac değeri bulunamadı' });
        }
    } catch (error) {
        console.error("Öğrenci sayac değeri alınırken bir hata oluştu:", error);
        res.status(500).send({ message: 'Bir hata oluştu, öğrenci sayac değeri alınamadı' });
    }
});



module.exports = router;

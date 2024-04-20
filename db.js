require('dotenv').config();
const { Pool } = require('pg');//PostgreSQL modülünün Pool sinifi veritabanı bağlantılarını etkin bir şekilde yönetmek
const pool = new Pool({//yeni bir Pool nesnesi oluşturuyoruz
    user: process.env.user,//veritabanına bağlan
    host: process.env.host,//sunucusunun konumunu
    database: process.env.database,//veritabanının adını
    password: process.env.password,//veritabani sifersi
    port: process.env.port//veritabanına bağlanmak için kullanılan port numarasını
})

module.exports = pool;
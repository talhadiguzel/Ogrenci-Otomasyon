const bodyParser = require("body-parser");
const express = require("express");
const ogrenciRouter = require("./ogrenci");
const bolumRouter = require("./bolum");
const counterRouter = require("./counter");
const mailRouter = require("./mail");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/ogrenci",ogrenciRouter);
app.use("/bolum",bolumRouter);
app.use("/counter",counterRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);//dinleniyor
});
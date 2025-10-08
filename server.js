const express = require('express');
const mongoose = require('mongoose');
const  folio = require('./components/folio');
const lices = require ('./components/Lices')
const path = require('path')




const dotenv = require ('dotenv');




const app = express();
const port = 8000;

const cors = require('cors');
app.use(cors());
dotenv.config();
app.use('/img', express.static(path.join(__dirname, '/img')))

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Главный маршрутизатор сервер успешно подключен');
    })
    .catch(err => {
        console.log('Ошибка подключения к MongoDB:', err);
    });


app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));



app.use('/portfol', folio);
app.use('/likos', lices);






app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express()
const path = require('path')


app.use('/img', express.static(path.join(__dirname, '/img')))
dotenv.config();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Mon подключена'))
  .catch(err => console.log('Ошибка подключения к MongoDB:', err));


const LiceSchema = new mongoose.Schema({
  deviceId: { type: String, required: false }, 
  productId: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  dizlace: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
  
}, { timestamps: true });

LiceSchema.index({ deviceId: 1, productId: 1 }, { unique: true });

const Lices = mongoose.model('Lices', LiceSchema);




app.get('/lice/:productId', async (req, res) => {
  try {
    const productId = await Lices.find().sort({ createdAt: -1 });
    res.json(productId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.post("/reaction", async (req, res) => {
  try {
    const { deviceId, productId, likeCount = 0, dizlace = 0, views  } = req.body;

  
    let record = await Lices.findOne({ deviceId, productId });

    if (record) {
  
      if (views > 0) record.views += views;
      record.likeCount = likeCount;
      record.dizlace = dizlace;
      await record.save();
    } else {
  
      record = await Lices.create({ deviceId, productId, likeCount, dizlace, views });
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось сохранить реакцию" });
  }
});





module.exports = app;

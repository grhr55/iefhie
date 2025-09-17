const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express()

dotenv.config();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Mon подключена'))
  .catch(err => console.log('Ошибка подключения к MongoDB:', err));


const LiceSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  dizlace: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
  
}, { timestamps: true });

LiceSchema.index({ deviceId: 1, productId: 1 }, { unique: true });

const Lices = mongoose.model('Lices', LiceSchema);


app.get('/lice/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const data = await Lices.find({ productId });
    res.json(data);
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Не удалось получить данные' });
  }
});




app.post('/reaction', async (req, res) => {
  try {
    const {  productId, likeCount, dizlace, views } = req.body;

    const update = {
      $set: {
        likeCount: likeCount || 0,
        dizlace: dizlace || 0,
      }
    };

    if (views && views > 0) {
      update.$inc = { views: views };
    }

    // апдейтим только по продукту
    const updated = await Lices.findOneAndUpdate(
      { productId }, // вместо deviceId
      update,
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось сохранить реакцию' });
  }
});





module.exports = app;

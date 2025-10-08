const express = require('express');
const mongoose = require('mongoose');
const app = express()
const cors = require('cors');
const dotenv = require ('dotenv');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');






app.use(cors());
app.use(express.json());
dotenv.config();


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Базаданых магазин успешно подключено');

        
        setInterval(async () => {
          try {
            await Portf.findOne();
            console.log("MongoDB keep-alive ping успешен");
          } catch (err) {
            console.error("Ошибка keep-alive ping:", err.message);
          }
        }, 5 * 60 * 1000); 
    })
    .catch(err => {
        console.log('Ошибка подключения к MongoDB:', err);
    });
    
    


const PortfolSchema = new mongoose.Schema({   
    name: { type: String, required: true },
    img: { type: String },
    figma: { type: String, required: true },
    opis: { type: String, required: true },
    orig: { type: String, required: true },
    teg: { type: String, required: true },
    seo: { type: String, required: true },
    proizvol: { type: String, required: true },
    sozdan: { type: String, required: true },

  
},{ timestamps: true });



const Portf = mongoose.model('Portfol', PortfolSchema);



const UPLOAD_DIR = path.join(__dirname, 'img');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
   const name = path.basename(file.originalname, ext); 
   const ext = path.extname(file.originalname);
   cb(null, name + '-' + unique + ext);
  }
});

const upload = multer({ storage });




app.use('/img', express.static(UPLOAD_DIR));






app.get('/porf', async (req, res) => {
  try {
    const products = await Portf.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/porfol',
  upload.fields([{ name: 'img', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, figma, opis ,orig ,teg ,seo ,proizvol ,sozdan } = req.body;

      let imgPath = null;
      if (req.files.img?.[0]) {
        imgPath = '/img/' + req.files.img[0].filename;
      }

      const product = new Portf({
        img: imgPath,
        name,
        figma,
        opis,
        orig,
        teg ,
        seo ,
        proizvol ,
        sozdan 
      });

      const saved = await product.save();

      
      res.status(201).json({
        id: saved._id,  
        ...saved.toObject()
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);





app.delete('/porfol/:id', async (req, res) => {
  try {
    const deleted = await Portf.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Не найено' });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/porfol/:id', async (req, res) => {
  try {
    const updated = await Portf.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Не найдено' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = app;
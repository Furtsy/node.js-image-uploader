const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const Darkmode = require('darkmode-js');
const app = express();
const port = 3000;


const storage = multer.diskStorage({
  destination: './public/resim/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('resim');


function checkFileType(file, cb){
  
  const filetypes = /jpeg|jpg|png|gif/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Hata sadece resim!');
  }
}

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

const requestIp = require('request-ip');
app.use(requestIp.mw())

app.post('/resim', (req, res) => {
new Darkmode().showWidget();
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: 'Dosya büyük'
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Dosya seçili değil'
        });
      } else {
        res.render('index', {
          msg: 'Dosya Yüklendi!',
          file: `resim/${req.file.filename}`,
          url: ` Resimin Linki: https://your-domain/resim/${req.file.filename}`
        });

}
    }
  });
});

app.listen(port, () => console.log(`${port} Portundan başladı`));

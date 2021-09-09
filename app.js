const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/testingRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use(express.json());

app.use('/', userRoutes);
app.use('/projects', projectRoutes);

app.use('/tokens', tokenRoutes);

//  app.use('/uploads', express.static(__dirname + '/uploads'));

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },

//   filename: function (req, file, cb) {
//     cb(null,  Date() + file.originalname);
//   },
// });

// var upload = multer({ storage: storage });

// app.post('/upload', upload.single('myFile'), async(req, res, next) => {
// const file = req.file
// if (!file) {
// const error = new Error('Please upload a file')
// error.httpStatusCode = 400
// return next("hey error")
// }

// const savedimage= await imagepost.save()
// res.json(savedimage)
// })
// app.get('/image',async(req, res)=>{
// const image = await model.find()
// res.json(image)
// })

module.exports = app;

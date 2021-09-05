const express = require('express');
const fs = require('fs');
const app = express();
const multer = require('multer');
const path = require('path');
const model = require('./models/imageModel');
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/testingRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use(express.json());
app.use('/projects', projectRoutes);

// app.use('./uploads', express.static(__dirname + './uploads'));

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     fs.mkdir('./uploads/', (err) => {
//       cb(null, './uploads/');
//     });
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// var upload = multer({ storage: storage });
// app.post('/upload', upload.single('myFile'), async (req, res, next) => {
//   const file = req.file;
//   console.log(file);
//   if (!file) {
//     const error = new Error('Please upload a file');
//     error.httpStatusCode = 400;
//     return next('hey error');
//   }

//   const imagepost = new model({
//     image: file.path,
//   });
//   const savedimage = await imagepost.save();
//   res.json(savedimage);
// });

// app.get('/image', async (req, res) => {
//   try {
//     const image = await model.find();
//     image.forEach(function (item, index) {
//       console.log(item.image);
//     });
//     // console.log(image.length);
//     res.json(image);
//   } catch (error) {
//     res.status(404).json({
//       status: 'sucesss',
//       message: error.message,
//     });
//   }

//   try {
//     fs.readFile('./uploads/', function (err, data) {
//       if (err) throw err; // Fail if the file can't be read.
//       res.writeHead(200, { 'Content-Type': 'image/jpeg' });
//       res.end(data); // Send the file data to the browser.
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

app.use('/', userRoutes);

app.use('/tokens', tokenRoutes);

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authController = require('./controllers/authController');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successfully');
  });

app.get('/', (req, res) => {
  res.end('this is working fine');
});
// app.post('/register/admin', authController.signup);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server has started at port ${port}`);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const express = require('express');
const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
  res.end('Welcome to EMS software!');
});

const port = process.env.PORT || 3000;
io.on('connection', (socket) => {
  console.log('connected');
  console.log(socket.id);
});

server.listen(port, () => {
  console.log(`Server has started at port ${port}`);
});

module.exports = port;

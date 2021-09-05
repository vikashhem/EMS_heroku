const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/testingRoutes');

app.use(express.json());

app.use('/', userRoutes);

app.use('/tokens', tokenRoutes);

module.exports = app;

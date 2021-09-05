const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/testingRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use(express.json());

app.use('/', userRoutes);
app.use('/projects', projectRoutes);

app.use('/tokens', tokenRoutes);

module.exports = app;

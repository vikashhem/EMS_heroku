const express = require('express');
// const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(express.json());
// app.use(cors());

app.use('/', adminRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/message', chatRoutes);

module.exports = app;

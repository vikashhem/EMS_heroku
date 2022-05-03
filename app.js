const express = require('express');
const path = require('path');
// const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

app.use(express.json());
app.use('/data', express.static(__dirname + '/data'));
app.use(express.static(path.join(__dirname, 'userImages')));

app.use('/', adminRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/message', chatRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});

app.use(globalErrorHandler);

module.exports = app;

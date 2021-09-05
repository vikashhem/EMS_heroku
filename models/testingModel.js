const mongoose = require('mongoose');

const testing = new mongoose.Schema({
  name: String,
  token: String,
});
const Test = mongoose.model('Test', testing);

module.exports = Test;

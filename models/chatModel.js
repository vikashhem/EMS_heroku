const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  senderId: String,
  receiverId: String,
  messageType: {
    type: String,
    enum: ['text', 'audio', 'video', 'pdf', 'docs', 'image'],
    default: 'text',
  },
  path: {
    type: String,
  },
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

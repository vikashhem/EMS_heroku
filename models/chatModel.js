const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  sender: String,
  receiver: String,
  UsersChat: this.sender + this.receiver,
  type: {
    type: String,
    enum: ['text', 'audio', 'video', 'pdf', 'docs', 'image'],
    default: 'text',
  },
  sendBy: String,
  path: {
    type: String,
  },
});
chatSchema.plugin(timestamps);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

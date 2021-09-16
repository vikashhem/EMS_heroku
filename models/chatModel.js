const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  UsersChat: { type: String, select: false },
  type: {
    type: String,
    enum: ['text', 'audio', 'video', 'pdf', 'docs', 'image'],
    default: 'text',
  },
  sendBy: String,
  path: {
    type: String,
    select: false,
  },
  versionKey: { select: false },
});
chatSchema.plugin(timestamps);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

var admin = require('firebase-admin');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
var serviceAccount = require('../key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.uploadToDataBase = async (req, res) => {
  try {
    const user = await User.findOne({ token: req.body.senderId });
    console.log(req.body.senderId);
    console.log(user);

    res.send(req.files);
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

exports.createChat = async (req, res) => {
  try {
    const sender = await User.findOne({ token: req.body.senderId });
    const receiver = await User.findOne({ token: req.body.receiverId });
    console.log(req.body.senderId, req.body.receiverId);
    // console.log(sender, receiver);

    let textMessage = {
      notification: {
        title: `${sender.username} sent a message`,
        body: `hi`,
      },
      data: {
        type: `${req.body.messageType}`,
      },
    };
    console.log(textMessage);

    const notification_options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
    const options = notification_options;

    const registrationToken = req.body.receiverId;

    if (registrationToken != null) {
      admin
        .messaging()
        .sendToDevice(registrationToken, textMessage, options)
        .then(() => {
          console.log('message successfully sent to device');
        })
        .catch((error) => {
          console.log(error);
        });
    } else console.log('empty token');
    res.send(req.body);

    // const newChat = await Chat.create(req.body);
    // res.status(200).json({
    //   status: true,
    //   newChat,
    // });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

var admin = require('firebase-admin');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const serviceAccount = require('../key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const DifferentTypeOfMessage = (sender, message, type) => {
  return {
    notification: {
      title: `${sender} sent a ${type} file`,
    },
    data: {
      type,
      url: `${message}`,
      sendFrom: `${sender}`,
      fileName: `${message}`,
    },
  };
};

exports.uploadToDataBase = async (req, res) => {
  try {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const messageToBeSaved = req.file.path;
    const message = req.file.originalname;
    const type = req.body.type;

    const findTokenOfReceiver = await User.find({
      username: req.body.receiver,
    });
    let token;

    if (req.body.receiver === req.body.sender) {
      throw new Error('You cannot send a message to yourself');
    }
    findTokenOfReceiver.forEach((element) => {
      token = element.token;
    });
    if (!token) {
      throw new Error('You cannot send a message');
    }
    console.log(token);

    const notification_options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
    const options = notification_options;

    const MessageToBeSent = DifferentTypeOfMessage(sender, message, type);
    // console.log(MessageToBeSent);

    const registrationToken = 'abcd';

    if (registrationToken != null) {
      admin
        .messaging()
        .sendToDevice(registrationToken, MessageToBeSent, options)
        .then(() => {
          console.log('message successfully sent to device');
        })
        .catch((error) => {
          console.log(error);
        });
    } else console.log('empty token');

    const newChat = await Chat.create({
      message: messageToBeSaved,
      sender,
      receiver,
      type,
      UsersChat: req.body.sender + req.body.receiver,
      path: req.file.path,
    });

    res.status(200).json({
      status: true,
      newChat,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

exports.createChat = async (req, res) => {
  try {
    const receiver = await User.find({ username: req.body.receiver });

    if (!receiver) {
      throw new Error('There is no user with the given username');
    }
    let token;

    // if (req.body.receiver === req.body.sender) {
    //   throw new Error('You cannot send a message to yourself');
    // }

    receiver.forEach((element) => {
      token = element.token;
    });
    console.log(token);
    let textMessage = {
      notification: {
        title: `${req.body.sender} sent a message`,
        body: `${req.body.message}`,
      },
      data: {
        type: `text`,
        url: `${req.body.message}`,
        sendFrom: `${req.body.sender}`,
      },
    };

    const notification_options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
    const options = notification_options;

    const registrationToken = token;

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

    const newChat = await Chat.create({
      message: req.body.message,
      // sender: req.body.sender,
      // receiver: req.body.receiver,
      type: 'text',
      sendBy: req.body.sender,
      UsersChat: req.body.sender + req.body.receiver,
    });
    res.status(200).json({
      status: true,
      newChat,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

exports.getChatBetweenUsers = async (req, res) => {
  try {
    const sender = req.body.sender;
    const receiver = req.body.receiver;

    const bothUser = await Chat.find({
      $or: [
        { UsersChat: { $eq: sender + receiver } },
        { UsersChat: { $eq: receiver + sender } },
      ],
    }).sort({ created_at: -1 });

    // let message = [];

    // bothUser.forEach((element) => {
    //   message.push(element.message);
    // });
    // if (message.length === 0) {
    //   message = 'No conversation!';
    // }

    res.status(201).json({
      status: true,
      bothUser,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

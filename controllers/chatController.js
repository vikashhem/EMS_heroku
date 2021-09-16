var admin = require('firebase-admin');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const serviceAccount = require('../key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const DifferentTypeOfMessage = (sender, fileName, type, path) => {
  return {
    notification: {
      title: `${sender} sent a ${type} file`,
    },
    data: {
      type,
      message: path,
      sendBy: `${sender}`,
      fileName: `${fileName}`,
    },
  };
};

exports.uploadToDataBase = async (req, res) => {
  try {
    const sender = req.body.sender;
    const fileName = req.body.fileName;
    const type = req.body.type;
    const path =
      'https://ems-heroku.herokuapp.com/data/' + req.file.originalname;

    const findTokenOfReceiver = await User.find({
      username: req.body.receiver,
    });
    let token;

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

    const MessageToBeSent = DifferentTypeOfMessage(
      sender,
      fileName,
      type,
      path
    );
    console.log(MessageToBeSent);
    const registrationToken = token;

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
      type,
      UsersChat: req.body.sender + req.body.receiver,
      sendBy: req.body.sender,
      message: path,
      fileName,
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

    const newChat = await Chat.create({
      message: req.body.message,
      type: 'text',
      sendBy: req.body.sender,
      UsersChat: req.body.sender + req.body.receiver,
    });

    let textMessage = {
      notification: {
        title: `${req.body.sender} sent a message`,
        body: `${req.body.message}`,
      },
      data: {
        type: `text`,
        message: `${req.body.message}`,
        sendBy: `${req.body.sender}`,
      },
    };
    cons;

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

    const chats = await Chat.find({
      $or: [
        { UsersChat: { $eq: sender + receiver } },
        { UsersChat: { $eq: receiver + sender } },
      ],
    }).sort({ created_at: -1 });

    res.status(201).json({
      status: true,
      chats,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

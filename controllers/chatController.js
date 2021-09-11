const multer = require('multer');
const path = require('path');
const Chat = require('../models/chatModel');
const factory = require('../utils/chatAPI');

//////////////////////////////////
// FOR STORING IMAGES
// const imageStorage = factory.storage('images');
// const imageUpload = factory.upload(imageStorage, 'image');
// exports.uploadSingleImage = factory.singleUpload('image', imageUpload);
// exports.uploadImage = factory.uploaded(Chat, 'image');

const storage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'data/images/');
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const up = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

const checkFileType = (file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    // upload only png and jpg format
    return cb(new Error('Please upload a Image'));
  }
  cb(undefined, true);
};

exports.uploadSingleImage = up.single('image');
exports.uploadImage = (req, res) => {
  try {
    console.log(req.file);
    res.send(req.file);
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

exports.createChat = async (req, res) => {
  try {
    const newChat = await Chat.create(req.body);
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

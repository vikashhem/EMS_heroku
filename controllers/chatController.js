const multer = require('multer');
const path = require('path');
const Chat = require('../models/chatModel');

const storage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    const type = file.mimetype.split('/', 1).join();
    console.log(type);
    switch (type) {
      case 'image':
        cb(null, 'data/images/');
        break;
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

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});
exports.up = upload.single('images');

const checkFileType = (file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    // upload only png and jpg format
    return cb(new Error('Please upload a Image'));
  }
  cb(undefined, true);
};

exports.uploadImage = (req, res) => {
  console.log(req.file);
  // const file = req.file.mimetype.split('/', 1).join();
  // const type = file;
  // console.log(file);
  res.send(req.file);
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

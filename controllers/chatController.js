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
      case 'audio':
        cb(null, 'data/audios/');
        break;
      case 'video':
        cb(null, 'data/videos/');
        break;
      case 'application':
        cb(null, 'data/docs/');
        break;
      // default:
      //   cb(null, 'data/others');
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
exports.uploadInServer = upload.single('files');

const checkFileType = (file, cb) => {
  if (
    !file.originalname.match(
      /\.(png|jpg|svg|jpeg|mp3|mp4|MPEG-4|mkv|pdf|docs)$/
    )
  ) {
    // upload only png and jpg format
    return cb(new Error('Please upload a file'));
  }
  cb(undefined, true);
};

exports.uploadToDataBase = (req, res) => {
  console.log(req.body.receiverId);
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

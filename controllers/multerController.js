const multer = require('multer');
const path = require('path');

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
    const type = file.mimetype.split('/', 1).join();
    cb(null, type + '_' + Date.now() + path.extname(file.originalname));
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
exports.uploadInServer = upload.array('files');

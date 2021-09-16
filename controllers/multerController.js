const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, 'data');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
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
    return cb(new Error('Please upload a file'));
  }
  cb(undefined, true);
};
exports.uploadInServer = upload.single('files');

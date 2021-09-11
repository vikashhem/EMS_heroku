// const multer = require('multer');
// const path = require('path');

// exports.storage = (destination) =>
//   multer.diskStorage({
//     destination,
//     filename: (req, file, cb) => {
//       cb(
//         null,
//         file.fieldname + '_' + Date.now() + path.extname(file.originalname)
//       );
//       // file.fieldname is name of the field (image)
//       // path.extname get the uploaded file extension
//     },
//   });

// exports.upload = (storage, type) =>
//   multer({
//     storage,
//     fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
//         // upload only png and jpg jpeg format
//         return cb(new Error(`Please upload a ${type}`));
//       }
//       cb(undefined, true);
//     },
//   });

// exports.singleUpload = (type, upload) => upload.single(type);
// exports.uploaded = (Model, type) => async (req, res) => {
//   try {
//     const newFile = await Model.create({
//       message: req.file.filename,
//       senderId: req.body.senderId,
//       receiverId: req.body.receiverId,
//       messageType: `${type}`,
//       path: req.file.path,
//     });
//     res.status(201).json({
//       status: true,
//       message: `${type}successfully uploaded`,

//       newFile,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };
//  const path = require('path');
//     const multer = require('multer');
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//            if (file.fieldname === "profile") {
//                cb(null, './uploads/profiles/')
//            }
//            else if (file.fieldname === "natid") {
//                cb(null, './uploads/ids/');
//            }
//            else if (file.fieldname === "certificate") {
//                cb(null, './uploads/certificates/')
//            }
//         },
//         filename:(req,file,cb)=>{
//             if (file.fieldname === "profile") {
//                 cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
//             }
//           else if (file.fieldname === "natid") {
//             cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
//           }
//           else if (file.fieldname === "certificate") {
//             cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
//           }
//         }
//     });
//     const upload = multer({
//         storage: storage,
//         limits: {
//             fileSize: 1024 * 1024 * 10
//         },
//         fileFilter: (req, file, cb) => {
//             checkFileType(file, cb);
//         }
//     }).fields(
//         [
//             {
//                 name:'profile',
//                 maxCount:1
//             },
//             {
//                 name: 'natid', maxCount:1
//             },
//             {
//                 name: 'certificate', maxCount:1
//             }
//         ]
//     );

//     function checkFileType(file, cb) {
//         if (file.fieldname === "certificate") {
//             if (
//                 file.mimetype === 'application/pdf' ||
//                 file.mimetype === 'application/msword' ||
//                 file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//               ) { // check file type to be pdf, doc, or docx
//                   cb(null, true);
//               } else {
//                   cb(null, false); // else fails
//               }
//         }
//         else if (file.fieldname === "natid" || file.fieldname === "profile") {
//             if (
//                 file.mimetype === 'image/png' ||
//                 file.mimetype === 'image/jpg' ||
//                 file.mimetype === 'image/jpeg'||
//                 fiel.mimetype==='image/gif'
//               ) { // check file type to be png, jpeg, or jpg
//                 cb(null, true);
//               } else {
//                 cb(null, false); // else fails
//               }
//             }
//         }
//     //at the save function

//  upload(req, res, (err) => {
//         if (err) {
//             console.log(err);
//         } else {
//             if (req.file == "undefined") {
//                 console.log("No image selected!")
//             } else {
//                 let datecreated = new Date();
//                 let fullnames = req.body.firstname + ' ' + req.body.lastname;
//                 let formatedphone = '';
//                 let phone = req.body.personalphone;
//                 if (phone.charAt(0) == '0') {
//                     formatedphone = '+254' + phone.substring(1);
//                 } else if ((phone.charAt(0) == '+') && (phone.length > 12 || phone.length <= 15)) {
//                     formatedphone = phone
//                 }
//                 let teachers = {
//                     "teacherid": teacherid,
//                     "schoolcode": req.body.schoolcode,
//                     "fullnames": fullnames,
//                     "email": req.body.email,
//                     "dateofbirth": req.body.dateofbirth,
//                     "nationalid": req.body.nationalid,
//                     "personalphone": formatedphone,
//                     "profile": req.files.profile[0].path,
//                     "natid": req.files.natid[0].path,
//                     "certificate":req.files.certificate[0].path
//                 }
//                 connection.query('INSERT INTO teachers SET ?', teachers, (error, results, fields) => {`enter code here`
//                     if (error) {
//                         res.json({
//                             status: false,
//                             message: 'there are some error with query'
//                         })
//                         console.log(error);
//                     } else {console.log("Saved successfully")};
//                   }
//                 }

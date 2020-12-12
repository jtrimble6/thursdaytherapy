// const multer = require("multer");
// const GridFsStorage = require('multer-gridfs-storage')
// const path = require("path");
// require('dotenv').config();
// //image upload
// // const storage = multer.diskStorage({
// //     destination: (req, res, cb) => {
// //          cb(null, path.join("./files/"));
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, new Date().toISOString() + file.originalname);
// //     }
// // });

// const storage = new GridFsStorage({
//     url: process.env.MONGODB_URI || "mongodb://localhost:27017/thursdaytherapy",
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads',
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });

// const upload = multer({ storage });
  
// // checking file type
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Not an image! Please upload an image.', 400), false);
//     }
// };
// exports.upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 6
//     },
//     fileFilter: fileFilter
// });
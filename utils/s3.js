const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_BUCKET_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region: region
});

const s3 = new AWS.S3();

const uploadFileToS3 = async (file) => {
  try {
    const upload = multer({
      storage: multerS3({
        s3,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, callback) {
          callback(null, `music/${Date.now().toString()}-${file.originalname}`);
        },
        metadata: function (req, file, callback) {
          callback(null, { fieldName: file.fieldname });
        },
      }),
    }).single('file');

    const result = await new Promise((resolve, reject) => {
      upload(file.req, file.res, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ Location: file.req.file.location });
        }
      });
    });

    return { Location: result.Location };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
};
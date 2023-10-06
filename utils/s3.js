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

    if (!file || !file.request || !file.response) {
      throw new Error('Invalid file object');
    }

    const result = await new Promise((resolve, reject) => {
      upload(file.request, file.response, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ Location: file.request.file.location });
        }
      });
    });

    return { Location: result.Location };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


module.exports = {
  uploadFileToS3,
};
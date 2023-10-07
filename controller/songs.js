const multer = require('multer');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const { Users, Songs } = require('../models/relations');
const sequelize = require('../utils/db');

const storage = multer.memoryStorage();
const AWS_SDK_LOAD_CONFIG =1 
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: Infinity,
  },
});

const uploadSong = async (request, response, next) => {
  const { userId, artist, title, file } = request.body;

  let t;
  try {
    t = await sequelize.transaction();
    const user = await Users.findByPk(userId);

    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      });
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_BUCKET_REGION
    });

    const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const uniqueName = uuid.v4();

    const songId = ` ${userId}/${uniqueName}_${Date.now()}`;
    const s3Key = `music/${songId}.mp3`;

    await s3
      .putObject({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: file, // Assign the file directly to the Body parameter
      })
      .promise();

    const newSong = await Songs.create(
      {
        title: title,
        s3Key: s3Key,
        artist: artist,
        userId: userId,
      },
      { transaction: t }
    );

    await user.addSongs(newSong, { transaction: t });
    await user.save();
    await t.commit();

    response.status(200).json({ message: 'Song uploaded successfully' });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
};

module.exports = {
  uploadSong,
  upload,
};
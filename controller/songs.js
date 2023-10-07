const {S3Client , PutObjectCommand} = require('@aws-sdk/client-s3');
const { Users, Songs } = require('../models/relations');
const uuid = require('uuid');
const sequelize = require('../utils/db');
require('dotenv').config()

const uploadSong = async (request, response, next) => {
  const { userId, artist, title } = request.body;
  const file = request.file 

  let t;
  const uniqueName = uuid.v4();

  const s3 = new S3Client({
    region:process.env.AWS_BUCKET_REGION,
    credentials :{
      accessKeyId : process.env.AWS_ACCES_KEY,
      secretAccessKey : process.env.AWS_SECRET_KEY
    }
  });

  try {
    t = await sequelize.transaction();
    const user = await Users.findByPk(userId);

    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      });
    }


    const songId = ` ${userId}/${uniqueName}_${Date.now()}`;
    const s3Key = `music/${songId}.mp3`;

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: s3Key,
        ContentType :file.mimetype
      }

    await s3.send(new PutObjectCommand(uploadParams)) //upload to aws bucket 

    const newSong = await Songs.create(
      {
        title: title,
        s3Key: s3Key,
        artist: artist,
        userId: userId,
      },
      { transaction: t }
    );

    // await user.addSongs(newSong, { transaction: t });
    // await user.save();
    // await t.commit();

    response.status(200).json({ message: 'Song uploaded successfully' , newSong });

  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error);
  }
};

module.exports = {
  uploadSong,
};




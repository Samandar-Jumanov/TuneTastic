const multer = require('multer');
const AWS = require('aws-sdk');
const uuid = require('uuid')
const {Users, Songs} = require('../models/relations');
const sequelize = require('../utils/db');

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const uploadSong =  async  (request, response , next ) => {
    const {userId , artist , title , file  } = request.body 

    let t ; 
  try {
    t = await sequelize.transaction();
    const user = await Users.findByPk(userId)

    if(!user){
        return response.status(404).json({
            message :'User not found '
        })
    }

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCES_KEY,
        secretAccessKey: process.env.AWS_BUCKETNAME,
      });
      const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
      const uniqueName = uuid.v4()

    const songId =` ${userId}/${uniqueName}_${Date.now()}`;
    const s3Key = `music/${songId}.mp3`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
    };

    await s3.upload(params).promise();

     const newSong = await Songs.create({
      title: title,
      artist: artist,
      s3Key: s3Key,
      userId: userId,
    } , { transaction : t });
    
    await user.addSongs(newSong)
    await user.save()
    await t.commit();

    response.status(200).json({ message: 'Song uploaded successfully' });
  } catch (error) {
    console.error(error);
    await t.rollback();
    next(error)
  }
}


module.exports =  {
  uploadSong,
  upload
}
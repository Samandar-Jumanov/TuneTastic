const {S3Client , PutObjectCommand , GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const { Users, Songs } = require('../models/relations');
const uuid = require('uuid');
const sequelize = require('../utils/db');
const  { getSignedUrl }  = require("@aws-sdk/s3-request-presigner");
require('dotenv').config()

const s3 = new S3Client({
  region:process.env.AWS_BUCKET_REGION,
  credentials :{
    accessKeyId : process.env.AWS_ACCES_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY
  }
});


const uploadSong = async (request, response, next) => {
  const { userId, artist, title } = request.body;
  const file = request.file 
  let t;
  const uniqueName = uuid.v4();
  try {
    t = await sequelize.transaction();
    const user = await Users.findByPk(userId);
    if (!user) {
      return response.status(404).json({
        message: 'User not found',
      });
    }

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: uniqueName + "_" + Date.now() + "_" + file.originalname,
      }

    await s3.send(new PutObjectCommand(uploadParams)) //upload to aws bucket 
    const newSong = await Songs.create({
        title: title,
        s3Key: uniqueName + "_" + Date.now() + "_" + file.originalname,
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

const getAllSongs = async (request , response , next ) =>{
  try {
    const allSongs = await Songs.findAll()

    for( const song of  allSongs){
      const params = {
        Bucket : process.env.AWS_BUCKET_NAME,
        Key : song.s3Key
      }
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })   
      song.s3Key = url 
    }

    return response.status(200).json({
      allSongs : allSongs
    })

  } catch (error) {
    console.log(error)
    next(error)
  }
}

const updateSong = async (request, response, next) => {
  let t ;
  try {
    t = await sequelize.transaction();

    const { userId, songId } = request.params;
    const { title, artist } = request.body;

    const user = await Users.findByPk(userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    const song = await user.getSongs({
      where: { Id: songId },
    } , { transaction : t });

    const songDb = await Songs.findByPk(songId)

    if(songDb){
      return response.status(404).json({
        message :' Song not  found '
      })
    }

    if (song.length === 0) {
      return response.status(404).json({
        message: "Song not found for the given user",
      });
    }
    
    await songDb.update({title : title , artist : artist} , { transaction : t })
    await song[0].update({ title, artist } , { transaction : t });
    await user.save()
    await songDb.save();
    await t.commit();
    response.json(song[0]);

  } catch (error) {
    await t.rollback();
    console.error(error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};


const deleteSong = async (request , response , next ) =>{
  const {userId , songId } = request.params 
  let t ;
  try {
     t = await sequelize.transaction();

    const user = await Users.findByPk(userId);
    const song = await Songs.findOne({ where: { id: songId, userId: user.id } } , { transaction : t });

    if (!user || !song) {
      return res.status(404).json({ message: 'User or song not found' });
    }
    
    const params = {
      Bucket : process.env.AWS_BUCKET_NAME,
      Key : song.s3Key 
    }
    const command = new DeleteObjectCommand(params)
    await s3.send(command)

    await user.removeSongs(song , { transaction : t });
    await song.destroy();
    await user.save()
    await t.commit();

    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.log(error)
    await t.rollback();
    next(error)
  }
}


const getUserCreatedSongs = async (request , response , next ) =>{
  const {userId} = request.params 

  try{

    const user = await Users.findByPk(userId)
    const allUserSongs = user.getSongs()

    for( const song of  allUserSongs){
      const params = {
        Bucket : process.env.AWS_BUCKET_NAME,
        Key : song.s3Key
      }
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })   
      song.s3Key = url 
    }

    return response.status(200).json({
      allUserSongs : allUserSongs
    })
  }catch(err){
    console.log(err)
    next(err)
  }
}

module.exports = {
  uploadSong,
  getAllSongs,
  updateSong,
  deleteSong,
  getUserCreatedSongs
};





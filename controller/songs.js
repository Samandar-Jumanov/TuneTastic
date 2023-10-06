const {uploadFile} = require('../utils/s3')
const {Songs , Users } = require('../models/relations');
const sequelize = require('../utils/db');

const uploadSong = async (request , response , next ) =>{
    const {songName , artist , genre , userId  , file  } = request.body 

    let t;
    try {
         t = await sequelize.transaction();
        const result  = await uploadFile(file);
        const newSong = await Songs.create({
          artist,
          genre,
          song: result.Location ,
          userId : userId , 
          songName : songName 
        } , { transaction : t });

        
        
        const user = await Users.findByPk(userId , { transaction : t })
        await user.addSongs(newSong , { transaction : t })
        await user.save()
        await t.commit();
        response.status(201).json({ success: true, message: 'Song uploaded successfully' });
      } catch (error) {
        await t.rollback();
        console.error('Error uploading file:', error);
        next(error)
      }
}

module.exports = {
    uploadSong 
}


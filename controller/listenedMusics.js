const { Songs, Users, ListenedMusic } = require("../models/relations");
const sequelize = require("../utils/db");


const addToListenedMusic = async (request ,response , next ) =>{
    const {songId , userId } = request.body 
    
    let t ;
    try {
        t = await sequelize.transaction();
        const song = await Songs.findByPk(songId)
        const user = await Users.findByPk(userId)

        if(!song  || !user){
            return response.status(404).json({
                message :' Song  or user not found '
            })
        }

        const addedSong = await ListenedMusic.create({
           title: song.title,
           userId : 1,
           s3Key : song.s3Key,
           artist : song.artist

        } , {transaction : t })

        await user.addListenedMusic(addedSong , {transaction : t })
        await user.save();
        await t.commit();
        
        return response.status(201).json({
            message :'Succes'
        })

    } catch (error) {
        await t.rollback();
        console.log(error)
        next(error)
    }
}



const getUserListeningHistory = async (request , response , next ) =>{
    const {userId} = request.body 

    try {
        const user = await Users.findByPk(userId , {
            include : [
                {model : ListenedMusic , as :'listenedMusic'}
            ]
        })

        if(!user || !userId){
            return response.json({
                message :'User required'
            })
        }

        const userListeningHistory = await user.getListenedMusic()
        return response.json({
            userListeningHistory : userListeningHistory
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const deleteListenedMusic = async (request, response, next) => {
    const { userId, songId } = request.body;
  
    let t;
    try {
      t = await sequelize.transaction();
      const user = await Users.findByPk(userId);
      const listenedMusic = await ListenedMusic.findByPk(songId)
      console.log(listenedMusic.userId)
      console.log(userId)
      await user.removeListenedMusic(listenedMusic, { transaction: t });
      await listenedMusic.destroy()
      await user.save();
      await t.commit();
  
      response.json({ message: 'Listened music deleted successfully' });
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  };


module.exports = {
    addToListenedMusic,
    getUserListeningHistory,
    deleteListenedMusic
}
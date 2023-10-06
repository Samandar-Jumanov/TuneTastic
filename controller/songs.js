const AWS = require('aws-sdk')
const fs = require('fs')
const { Songs, Users } = require('../models/relations')
const sequelize = require('../utils/db')




const uploadSong = async (request , response , next ) =>{
    const {song , author } = request.body 
 let t ;

    try {
         t =  await sequelize.transaction();
        const user = await Users.findOne({
            where : {
                author 
            }
        })

        if (!user){
            return response.status(404).json({
                message :'User not found'
            })
        }

        const s3 = new AWS.S3()
        const bucketName = process.env.AWS_BUCKET_NAME
        const fileName = song 
        const fileData =   fs.readFileSync(fileName)

        const result = await s3.upload({
            Bucket : bucketName,
            Key : fileName,
            Body : fileData,
            ContentType: 'audio/mpeg',
        })

        const location = await result.Location
        const newSong = await Songs.create({
            songId : location ,
            author : author ,
            userId : user.Id 
        } , { transaction : t })
    
        await user.addSongs(newSong , { transaction : t })
        await user.save()
        await t.commit()
        
        return response.json({
            messaage :'Song uploaded ',
            song : newSong 
        })

    } catch (error) {
        console.log(error)
        await t.rollback();
        next(error)
    }
}



module.exports ={
    uploadSong 
}
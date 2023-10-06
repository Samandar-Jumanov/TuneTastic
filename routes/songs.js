const songsRouter = require('express').Router()
const songsController = require('../controller/songs')
const { upload } = require('../utils/multer')
const { authRole } = require('../utils/authRole')
const { authToken } = require('../utils/authToken')



songsRouter.post('/upload-song',  upload.single('file'), songsController.uploadSong )

module.exports ={
    songsRouter 
}
//authRole , authToken ,
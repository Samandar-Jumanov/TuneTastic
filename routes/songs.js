const songsRouter = require('express').Router()
const songsController = require('../controller/songs')
const { authRole } = require('../utils/authRole')
const { authToken } = require('../utils/authToken')
const {upload} = require('../utils/multer')

songsRouter.post('/upload-song',  upload.single('audio'),  songsController.uploadSong )

module.exports ={
    songsRouter 
}

//authRole , authToken ,
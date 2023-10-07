const songsRouter = require('express').Router()
const songsController = require('../controller/songs')
const { authRole } = require('../utils/authRole')
const { authToken } = require('../utils/authToken')

songsRouter.post('/upload-song',  songsController.upload.single('file'),  songsController.uploadSong )

module.exports ={
    songsRouter 
}
//authRole , authToken ,
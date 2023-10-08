const songsRouter = require('express').Router()
const songsController = require('../controller/songs')
const { authRole } = require('../utils/authRole')
const { authToken } = require('../utils/authToken')
const {upload} = require('../utils/multer')

songsRouter.post('/upload-song',  authRole , authToken ,  upload.single('file'),  songsController.uploadSong )
songsRouter.get('/get-all-songs',  authRole , authToken ,    songsController.getAllSongs )
songsRouter.put('/update-song/:songId/:userId', authRole , authToken ,  songsController.updateSong )
songsRouter.delete('/update-song/:songId/:userId',  authRole , authToken , songsController.deleteSong )
songsRouter.get('/user-created/:userId',  authRole , authToken ,    songsController.getUserCreatedSongs )


module.exports ={
    songsRouter 
}

//authRole , authToken ,
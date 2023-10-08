const listenedMusicController = require('../controller/listenedMusics')
const listendMusicRouter = require('express').Router();

listendMusicRouter.post('/add', listenedMusicController.addToListenedMusic)
listendMusicRouter.get('/get-all/:userId', listenedMusicController.getUserListeningHistory)
listendMusicRouter.delete('/delete/:userId/:songId', listenedMusicController.deleteListenedMusic)

module.exports ={
    listendMusicRouter
}


const listenedMusicController = require('../controller/listenedMusics')
const listendMusicRouter = require('express').Router();

listendMusicRouter.post('/add', listenedMusicController.addToListenedMusic)
listendMusicRouter.get('/get-all', listenedMusicController.getUserListeningHistory)
listendMusicRouter.delete('/add', listenedMusicController.deleteListenedMusic)

module.exports ={
    listendMusicRouter
}


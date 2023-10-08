const listenedMusicController = require('../controller/listenedMusics')
const listendMusicRouter = require('express').Router();

listendMusicRouter.post('/add/:songId/:userId', listenedMusicController.addToListenedMusic)
listendMusicRouter.get('/get-all', listenedMusicController.getUserListeningHistory)
listendMusicRouter.delete('/delete', listenedMusicController.deleteListenedMusic)

module.exports ={
    listendMusicRouter
}


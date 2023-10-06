const usersController = require('../controller/users')
const usersRouter = require('express').Router()

usersRouter.post('/signup', usersController.SignUp)
usersRouter.post('/login', usersController.Login)

module.exports = {
    usersRouter
}

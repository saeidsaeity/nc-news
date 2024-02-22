const { UsersController } = require('../controllers/controller');
const usersController = new UsersController()
const userRouter = require('express').Router();


userRouter.get('/',usersController.getUsers)
userRouter.get('/:username',usersController.getUserByName)
module.exports = userRouter

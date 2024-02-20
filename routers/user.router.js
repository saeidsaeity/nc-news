const { getUsers } = require('../controllers/controller');

const userRouter = require('express').Router();


userRouter.get('/',getUsers)

module.exports = userRouter

const { getTopics } = require('../controllers/controller')

const topicRouter = require('express').Router()

topicRouter.get('/',getTopics)
module.exports = topicRouter



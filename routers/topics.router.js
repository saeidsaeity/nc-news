const { TopicsController } = require('../controllers/controller')
const topicsController = new TopicsController()
const topicRouter = require('express').Router()

topicRouter.route('/').get(topicsController.getTopics)
.post(topicsController.postTopic)
module.exports = topicRouter



const { CommentsController } = require('../controllers/controller');

const commentsController = new CommentsController

const commentRouter  = require('express').Router();

commentRouter.route('/:comment_id')
.delete(commentsController.deleteComment)
.patch(commentsController.patchCommentVotes)

module.exports = commentRouter
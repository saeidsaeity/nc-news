const {
  getArticles,
  getArticleById,
  patchArticle,
  getCommentsByArticle,
  postComment,
  postArticle,
  deleteArticle,
} = require("../controllers/controller");

const articleRouter = require("express").Router();

articleRouter.route('/').get(getArticles).post(postArticle)

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticle).delete(deleteArticle)
articleRouter.route('/:article_id/comments').get(getCommentsByArticle)
.post(postComment)

module.exports = articleRouter;

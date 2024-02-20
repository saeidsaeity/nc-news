const {
  getArticles,
  getArticleById,
  patchArticle,
  getCommentsByArticle,
  postComment,
  postArticle,
} = require("../controllers/controller");

const articleRouter = require("express").Router();

articleRouter.route('/').get(getArticles).post(postArticle)

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articleRouter.route('/:article_id/comments').get(getCommentsByArticle)
.post(postComment)

module.exports = articleRouter;

const {
  ArticlesController
} = require("../controllers/controller");
const articlesController = new ArticlesController()
const articleRouter = require("express").Router();

articleRouter.route('/').get(articlesController.getArticles).post(articlesController.postArticle)

articleRouter.route("/:article_id").get(articlesController.getArticleById).patch(articlesController.patchArticle).delete(articlesController.deleteArticle)
articleRouter.route('/:article_id/comments').get(articlesController.getCommentsByArticle)
.post(articlesController.postComment)

module.exports = articleRouter;

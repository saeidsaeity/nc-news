const {
  getArticles,
  getArticleById,
  patchArticle,
  getCommentsByArticle,
  postComment,
} = require("../controllers/controller");

const articleRouter = require("express").Router();

articleRouter.get("/", getArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articleRouter.route('/:article_id/comments').get(getCommentsByArticle)
.post(postComment)

module.exports = articleRouter;

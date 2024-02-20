const express = require("express");
const apiRouter = require("./routers/api.router");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsByArticle,
  postComment,
  patchArticle,
  deleteComment,
  getUsers,
} = require("./controllers/controller");
const app = express();
app.use(express.json());
app.use("/api", apiRouter);


app.use((err, req, res, next) => {
  if (err.code === "42703" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});
app.use((err, req, res, nex) => {
  //console.log(err)
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  }
});
module.exports = app;

const apiRouter = require("express").Router();
const { getApi } = require("../controllers/controller");
const articleRouter = require("./articles.router");
const commentRouter = require('./comments.router');
const topicRouter = require("./topics.router");
const userRouter = require("./user.router");
apiRouter.get("/",getApi)
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments",commentRouter)
apiRouter.use("/topics",topicRouter)
apiRouter.use('/users',userRouter)
module.exports = apiRouter;

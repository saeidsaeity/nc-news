const {selectApi,
    UsersModel,
    ArticlesModel,TopicsModel, CommentsModel} = require('../models/model');
    
class ArticlesController{
    constructor(){
        this.articlesModel = new ArticlesModel()
        this.postArticle = this.postArticle.bind(this)
        this.getArticles = this.getArticles.bind(this)
        this.getArticleById = this.getArticleById.bind(this)
        this.patchArticle = this.patchArticle.bind(this)
        this.getCommentsByArticle = this.getCommentsByArticle.bind(this)
        this.postComment = this.postComment.bind(this)
        this.deleteArticle = this.deleteArticle.bind(this)
      
    }

    async getArticles(req,res,next){
        try{const query = req.query
            const articles = await this.articlesModel.selectAllArticles(query)
            res.status(200).send(articles)}
        catch(error){next(error)}}
    async  getArticleById(req,res,next) {
            try{const articleId=req.params.article_id
                const article = await this.articlesModel.selectArticle(articleId)
                res.status(200).send({article}) }
            catch(error){ next(error)}}
    async  patchArticle(req,res,next){
                try {const adjustVotes = req.body.inc_votes
                    const articleId = req.params.article_id
                   const article = await this.articlesModel.updateArticle(adjustVotes,articleId)
                   res.status(200).send({article:article})
                } catch (error) {next(error)}}
    async getCommentsByArticle(req,res,next){
                    
        try{const articleId = req.params.article_id
                        const page = req.query
                        
                        const comments = await this.articlesModel.selectCommentsByArticle(articleId,page)
                        res.status(200).send(comments)}
                    catch(error){next(error)}}
     async postComment(req,res,next){
                        try {const articleId = req.params.article_id
                            const commentinfo =req.body
                            const comment =await this.articlesModel.insertComment(commentinfo,articleId)
                            res.status(201).send({comment})
                        } catch (error) {next(error)}}


                        async postArticle(req,res,next){
                            try{
                            
                            const articleBody = req.body
                            const article =await this.articlesModel.insertArticles(articleBody)
                            res.status(201).send({article})
                            }
                            catch(error){
                              
                                next(error)
                            }
                        }
                        async  deleteArticle(req,res,next){
                            try {
                                
                                await this.articlesModel.removeArticle(req.params.article_id)
                                res.status(204).send('')
                    
                            } catch (error) {
                                next(error)
                                
                            }
                        }


}

class TopicsController{
   constructor(){
    this.topicsModel = new TopicsModel()
    this.getTopics = this.getTopics.bind(this)
    this.postTopic = this.postTopic.bind(this)
 
   }
    async getTopics(req,res,next) {
        try{const topicsdata = await this.topicsModel.selectTopics()
        res.status(200).send({topics: topicsdata})
        }catch(error){next(error)}}

    async postTopic(req,res,next){
            try {
                const newTopic = req.body
                const topic =await this.topicsModel.insertTopic(newTopic)
                res.status(201).send({topic})
            } catch (error) {
                next(error)
                
            }
        }
}


class CommentsController{
    constructor(){
        this.commentsModel = new CommentsModel
        this.deleteComment = this.deleteComment.bind(this)
        this.patchCommentVotes = this.patchCommentVotes.bind(this)
    }
    async deleteComment(req,res,next){
        try {const commentId = req.params.comment_id
            await this.commentsModel.removeComment(commentId)
            res.status(204).send()
        } catch (error) {next(error) }}
        async  patchCommentVotes(req,res,next){
            try {
                const commentId = req.params.comment_id
                const changeVotes = req.body.inc_votes
                const comment = await this.commentsModel.updateCommentVotes(commentId,changeVotes)
                res.status(200).send({comment})
            } catch (error) {
                next(error)
                
            }
        }

}
class UsersController{
    constructor(){
        this.usersModel = new UsersModel()
        this.getUsers = this.getUsers.bind(this)
        this.getUserByName = this.getUserByName.bind(this)
    }
        async getUsers(req,res,next){try {const users = await this.usersModel.selectUsers()
            res.status(200).send({users})}catch (error) {next(error)}}
    
    
        async getUserByName(req,res,next){
            try { const username = req.params.username
                const user = await this.usersModel.selectUserByName(username)
                res.status(200).send({user})
             } catch (error){next(error)}} 
    }

    async function getApi(req,res,next) {
        try{const apiData = await selectApi()
        res.status(200).send(apiData)}
        catch(error){next(error)}}
    

   
   
   
module.exports = {
    
    getApi,
    UsersController,
    CommentsController,
    TopicsController,
    ArticlesController}
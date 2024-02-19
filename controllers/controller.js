const {selectTopics,selectApi,selectArticle,selectAllArticles,selectCommentsByArticle} = require('../models/model');

   
    async function getTopics(req,res,next) {
        try{
      
  
        const topicsdata = await selectTopics()
        res.status(200).send({topics: topicsdata})
        }
        catch(error){console.log(error)}
        
        
    }
    async function getApi(req,res,next) {
        try{
        const apiData = await selectApi()
        res.status(200).send(apiData)

        }
        catch(error){
            console.log(error)

        }
        
    }
    async function getArticleById(req,res,next) {
        try{
            const articleId=req.params.article_id
            
            const article = await selectArticle(articleId)
            res.status(200).send({article})

        }
        catch(error){
            next(error)

        }
        
    }
    async function getArticles(req,res,next){
        try{
            const articles = await selectAllArticles()
            res.status(200).send({articles})

        }
        catch(error){
            next(error)
        }
    }
    async function getCommentsByArticle(req,res,next){
        try{
            const articleId = req.params.article_id
            const comments = await selectCommentsByArticle(articleId)
            res.status(200).send({comments})

        }
        catch(error){
            //console.log(error);
            next(error)

        }
    }

module.exports = {getTopics,getApi,getArticleById,getArticles,getCommentsByArticle}
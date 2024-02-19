const {selectTopics,selectApi,selectArticle,selectAllArticles,selectCommentsByArticle,insertComment,updateArticle,removeComment} = require('../models/model');

   
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
    async function postComment(req,res,next){
        try {
            const articleId = req.params.article_id
            const commentinfo =req.body
           
            const comment =await insertComment(commentinfo,articleId)
            res.status(201).send({comment})
        } catch (error) {
            next(error)
            
        }
    }
    async function patchArticle(req,res,next){
        try {
            const adjustVotes = req.body.inc_votes
            const articleId = req.params.article_id
          
           const article = await updateArticle(adjustVotes,articleId)
           res.status(200).send({article:article})
        } catch (error) {
            next(error)
            
        }
    }
    async function deleteComment(req,res,next){
        try {
            const articleId = req.params.article_id
            await removeComment()
            res.status(204).send()

        } catch (error) {
            next(error)
            
        }
    }
module.exports = {getTopics,getApi,getArticleById,getArticles,getCommentsByArticle,postComment,patchArticle,deleteComment}
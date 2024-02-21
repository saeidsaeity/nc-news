const {selectTopics,selectApi,selectArticle,selectAllArticles,selectCommentsByArticle,insertComment,updateArticle,removeComment,selectUsers,selectUserByName,updateCommentVotes, insertArticles} = require('../models/model');

   
    async function getTopics(req,res,next) {
        try{const topicsdata = await selectTopics()
        res.status(200).send({topics: topicsdata})
        }catch(error){next(error)}}

    async function getApi(req,res,next) {
        try{const apiData = await selectApi()
        res.status(200).send(apiData)}
        catch(error){next(error)}}

    async function getArticleById(req,res,next) {
        try{const articleId=req.params.article_id
            const article = await selectArticle(articleId)
            res.status(200).send({article}) }
        catch(error){ next(error)}}

    async function getArticles(req,res,next){
        try{const query = req.query
            const articles = await selectAllArticles(query)
            res.status(200).send(articles)}
        catch(error){next(error)}}
        
    async function getCommentsByArticle(req,res,next){
        try{const articleId = req.params.article_id
            const page = req.query
            
            const comments = await selectCommentsByArticle(articleId,page)
            res.status(200).send(comments)}
        catch(error){next(error)}}

    async function postComment(req,res,next){
        try {const articleId = req.params.article_id
            const commentinfo =req.body
            const comment =await insertComment(commentinfo,articleId)
            res.status(201).send({comment})
        } catch (error) {next(error)}}

    async function patchArticle(req,res,next){
        try {const adjustVotes = req.body.inc_votes
            const articleId = req.params.article_id
           const article = await updateArticle(adjustVotes,articleId)
           res.status(200).send({article:article})
        } catch (error) {next(error)}}

    async function deleteComment(req,res,next){
        try {const commentId = req.params.comment_id
            await removeComment(commentId)
            res.status(204).send()
        } catch (error) {next(error) }}

    async function getUsers(req,res,next){try {const users = await selectUsers()
        res.status(200).send({users})}catch (error) {next(error)}}

    async function getUserByName(req,res,next){
        try { const username = req.params.username
            const user = await selectUserByName(username)
            res.status(200).send({user})
         } catch (error){next(error)}}

    async function patchCommentVotes(req,res,next){
        try {
            const commentId = req.params.comment_id
            const changeVotes = req.body.inc_votes
            const comment = await updateCommentVotes(commentId,changeVotes)
            res.status(200).send({comment})
        } catch (error) {
            next(error)
            
        }
    }
    async function postArticle(req,res,next){
        try{
        const articleBody = req.body
        const article =await insertArticles(articleBody)
        res.status(201).send({article})
        }
        catch(error){
            next(error)
        }
    }
module.exports = {getTopics,getApi,getArticleById,getArticles,getCommentsByArticle,postComment,patchArticle,deleteComment,getUsers,getUserByName,patchCommentVotes,postArticle}
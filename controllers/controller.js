const {selectTopics,selectApi,selectArticle} = require('../models/model');

   
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


module.exports = {getTopics,getApi,getArticleById}
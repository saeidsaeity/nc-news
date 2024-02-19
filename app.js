const express = require('express');
const {getTopics,getApi,getArticleById} = require('./controllers/controller')
const app = express()

app.get('/api',getApi)
app.get('/api/topics',getTopics)
app.get('/api/articles/:article_id',getArticleById)
app.use((err,req,res,next)=>{
    if(err.code === '42703' || err.code === '22P02'){
        res.status(400).send({msg: 'Bad Request'})

    }
    next(err)
})
app.use((err,req,res,nex)=>{
    //console.log(err)
    if(err.status && err.msg){
      
        res.status(err.status).send(err)
    }
})
module.exports = app
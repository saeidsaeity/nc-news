const db = require('../db/connection');
const fs = require('fs/promises');
   
    async function selectTopics(){
       
        const {rows} = await db.query('SELECT * FROM topics ')
      
        return rows


    }
    async function selectApi(){
        const apidata = await fs.readFile(`${__dirname}/../endpoints.json`)
        
        return JSON.parse(apidata)
        

    }
   async function selectArticle(articleId){
  
    const {rows} = await db.query('SELECT * FROM articles WHERE article_id = $1',[articleId])
    if(rows.length > 0){
    return rows[0]
    }
    else{
        return Promise.reject({status:404, msg: "Article Id does not exist"})
    }

   }
async function selectAllArticles(){
   
    const {rows} = await db.query(`SELECT articles.author,title,articles.article_id,topic,articles.created_at,articles.votes,article_img_url,COUNT(comments.comment_id) AS comment_count 
    FROM articles
    JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
     `)
     return rows
    }
   

async function selectCommentsByArticle(article_id){

    
    const {rows} = await db.query(`SELECT comments.comment_id,comments.votes,comments.created_at,comments.author,comments.body,comments.article_id 
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1`,[article_id])
  
    return rows.length >0 ? rows : Promise.reject({status:404, msg: "Comments with this Article Id dont exist"})
    
        
        
    
    
    

}
module.exports = {
    selectTopics,
    selectApi,
    selectArticle,
    selectAllArticles,
    selectCommentsByArticle
};

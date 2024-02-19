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
    try{
    const {rows} = await db.query(`SELECT articles.author,title,articles.article_id,topic,articles.created_at,articles.votes,article_img_url,COUNT(comments.comment_id) AS comment_count 
    FROM articles
    JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
     `)
     return rows
    }
    catch(error){
        console.log(error)
    }
}
module.exports = {
    selectTopics,
    selectApi,
    selectArticle,
    selectAllArticles
};

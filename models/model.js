const { log } = require("console");
const db = require("../db/connection");
const fs = require("fs/promises");

async function selectTopics() {
  const { rows } = await db.query("SELECT * FROM topics ");

  return rows;
}
async function selectApi() {
  const apidata = await fs.readFile(`${__dirname}/../endpoints.json`);

  return JSON.parse(apidata);
}
async function selectArticle(articleId) {
  
  const {rows} = await db.query(`SELECT articles.*,COUNT(comments.comment_id ) AS comment_count 
  FROM articles 
  JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  `,[articleId])
  
  return rows.length > 0
    ? rows[0]
    : Promise.reject({ status: 404, msg: "Article Id does not exist" });
  
  
}
async function selectAllArticles(query) {
    const validQueries = ['sort_by','topic','order']
    const currentquery = Object.keys(query)[0]
    try{
   // console.log(currentquery)
    if(validQueries.includes(currentquery) || Object.keys(query).length === 0){
      
      switch(currentquery){

        case 'topic':
        const topics =await db.query(`SELECT topic FROM articles`)
        if(topics.rows.some((topic)=> topic.topic === query.topic)){
        const articledata = await db.query(`SELECT * from articles WHERE topic = $1`,[query.topic])
        return articledata.rows
        }
        return Promise.reject({status:404, msg:'Query not found'})
        
        case undefined:
          const { rows } = await db.query(`SELECT articles.author,title,articles.article_id,topic,articles.created_at,articles.votes,article_img_url,COUNT(comments.comment_id) AS comment_count 
          FROM articles
          JOIN comments 
          ON articles.article_id = comments.article_id
          GROUP BY articles.article_id
          ORDER BY articles.created_at DESC
           `);
        return rows;
        case 'sort_by':
          console.log(query.sort_by === '' )
        const validcolumns =await db.query(`SELECT * FROM articles`)
        if(validcolumns.rows.some((row)=> row[query.sort_by] !== undefined)){
        const {rows} = await db.query(`articles.author,title,articles.article_id,topic,articles.created_at,articles.votes,article_img_url,COUNT(comments.comment_id) AS comment_count
        FROM articles
          JOIN comments 
          ON articles.article_id = comments.article_id
          GROUP BY articles.article_id
          ORDER BY articles.${query.sort_by} DESC `)
        
        return rows
        }
        else if(query.sort_by === '' ){
          const {rows} = await db.query(`articles.author,title,articles.article_id,topic,articles.created_at,articles.votes,article_img_url,COUNT(comments.comment_id) AS comment_count
          FROM articles
            JOIN comments 
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC `)
        
          return rows

        }
        return Promise.reject({status:404, msg:'Query not found'})
        default:
          return Promise.reject({status:404, msg:'Query not found'})

      }
  
    }
    else{
        return Promise.reject({status:400,msg:'Bad Query'})
    }
  
}
catch(error){
  console.log(error);
}
}


    
    
    
    




async function selectCommentsByArticle(article_id) {
  const validArticleIds = await db.query(`SELECT article_id From articles`)
   
    
   
  const { rows } = await db.query(
    `SELECT comments.comment_id,comments.votes,comments.created_at,comments.author,comments.body,comments.article_id 
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1`,
    [article_id]
  );
  if(!validArticleIds.rows.some((article)=> {return article.article_id === Number(article_id)})){
    return Promise.reject({status:404, msg: 'Article Id doesnt exist'})

  }
  return rows
}
async function insertComment(commentinfo, articleId) {

    if (
      (
        await db.query("SELECT * FROM articles WHERE article_id = $1", [
          articleId,
        ])
      ).rows.length === 0
    ) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    
    if(!commentinfo.username || !commentinfo.body){
      return Promise.reject({status: 400,msg: 'Bad Request'})
    }
    if(typeof commentinfo.username !== 'string'|| typeof commentinfo.body !== 'string'){
      return Promise.reject({status :400,msg: 'Bad Request'})
    }
    if (
      (
        await db.query("SELECT username FROM users WHERE username = $1", [
          commentinfo.username,
        ])
      ).rows.length === 0
    ) {
      return Promise.reject({
        status: 404,
        msg: "username doesnt exist create a profile first before commenting",
      });
    }

    const { rows } = await db.query(
      `INSERT INTO comments 
    (author,body,article_id,votes)
    VALUES
    ($1,$2,$3,$4)
    RETURNING *`,
      [commentinfo.username, commentinfo.body, articleId, 0]
    );
    return rows[0];

}

async function updateArticle(adjustVotes, article_id) {
 
    
    
    if ((await db.query("SELECT * FROM articles WHERE article_id = $1", [article_id,])).rows.length === 0) {
      return Promise.reject({ status: 404, msg: "article doesnt exist" });
    }
    if(typeof adjustVotes!== 'number'){
        return Promise.reject({status: 400, msg: "Bad Request incorrect format"})
    }
    let { rows } = await db.query(
      "SELECT votes FROM articles WHERE article_id = $1",
      [article_id]
    );
   const adjustedVotes = rows[0].votes+adjustVotes
    if(adjustVotes  < 0){
    return Promise.reject({status: 400, msg: "Bad Request votes cant go below zero"})
    }
    const output = await db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,[adjustedVotes,article_id])
    
    return output.rows[0];
  
}
async function removeComment(commentId){


    const {rows}= await db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *',[commentId])
   return rows.length === 0 ?  Promise.reject({status:404, msg: 'Comment doesnt exist'}) : rows 

}
async function selectUsers(){
    
    
    const {rows} = await db.query('SELECT username,name, avatar_url FROM users')
   
    return rows

}
    
module.exports = {
  selectTopics,
  selectApi,
  selectArticle,
  selectAllArticles,
  selectCommentsByArticle,
  insertComment,
  updateArticle,
  removeComment,
  selectUsers
};

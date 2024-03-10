
const { log } = require("console");
const db = require("../db/connection");
const fs = require("fs/promises");
class ArticlesModel{
  async pagination(limit,articleData,queryString,offset,toggle=1,topic = '',type = 'articles',comments = 0){
    
    if(limit !== undefined){
      const total_count = articleData.rows.length
      queryString += ` LIMIT $${toggle} OFFSET $${toggle+1}`
      let articles = ''
      toggle>1? articles = await db.query(queryString,[topic,limit,offset]):articles =await db.query(queryString,[limit,offset]) 
      const userRequest = {}
      userRequest[type]=articles.rows
      userRequest.total_count = total_count
     if(comments === 1){
      return userRequest
     }
      return articles.rows.length > 0 ? userRequest: Promise.reject({ status: 404, msg: 'Query not found' });      
    } 
  }
  
  async selectArticle(articleId) {
  
    const {rows} = await db.query(`SELECT articles.*,COUNT(comments.comment_id ) AS comment_count 
    FROM articles 
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `,[articleId])
    
    return rows.length > 0?rows[0]: Promise.reject({ status: 404, msg: "Article Id does not exist" });
    
    
  }
  async selectAllArticles(query) {
    const currentQuery = Object.keys(query)[0]
    const validqueries = ['topic','sort_by','order','limit',undefined]
    query.p = query.p || 1
    if(validqueries.includes(currentQuery)){
      let queryString = `
      SELECT articles.author, title, articles.article_id, topic, articles.created_at, 
      articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
  `
  const offset = (query.p * query.limit )-query.limit
    switch(currentQuery){
      case 'topic':
      queryString += `WHERE topic = $1 GROUP BY articles.article_id`
      let articles = await db.query(queryString, [query.topic]);
       return query.limit !== undefined ? this.pagination(query.limit,articles,queryString,offset,2,query.topic) : articles.rows.length > 0 ? {articles:articles.rows} : Promise.reject({ status: 404, msg: 'Query not found' });
      case 'sort_by':
        query.order === undefined ? query.order = 'desc': ''
        if(!['asc','desc'].includes(query.order)){return Promise.reject({status:400, msg : 'Bad Request'})}
        queryString += `GROUP BY articles.article_id ORDER BY ${query.sort_by !== '' ? query.sort_by : 'created_at'} ${query.order.toUpperCase()}`
        const articleData  = await db.query(queryString)
        return query.limit !== undefined ? this.pagination(query.limit,articleData,queryString,offset):{articles:articleData.rows}
      case 'limit':
        queryString += 'GROUP BY articles.article_id'
        const lengthcheck = await db.query(queryString)
        return this.pagination(query.limit,lengthcheck,queryString,offset)
      case undefined:
        queryString += `GROUP BY articles.article_id ORDER BY articles.created_at DESC`
        const { rows } = await db.query(queryString);
        return {articles:rows};
      default:
  }
    }
  return Promise.reject({status:400,msg:'Bad Query'})

 
}
async selectCommentsByArticle(article_id,page) {
  const validArticleIds = await db.query(`SELECT article_id From articles`)
  let queryString = `SELECT comments.comment_id,comments.votes,comments.created_at,comments.author,comments.body,comments.article_id 
  FROM articles
  JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1`
  const { rows } = await db.query(
    queryString,
    [article_id]
  );
  page.limit === ''? page.limit = 10: ''
  page.p = page.p|| 1
  const offset = (page.p * page.limit )-page.limit
  return page.limit !== undefined ? this.pagination(page.limit,{rows},queryString,offset,2,article_id,'comments',1): !validArticleIds.rows.some((article)=> {return article.article_id === Number(article_id)})? Promise.reject({status:404, msg: 'Article Id doesnt exist'}): {comments:rows}
}
async insertComment(commentinfo, articleId) {

  if ((await db.query("SELECT * FROM articles WHERE article_id = $1", [articleId,])).rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }
  
  if(!commentinfo.username || !commentinfo.body){
    return Promise.reject({status: 400,msg: 'Bad Request'})
  }
  if(typeof commentinfo.username !== 'string'|| typeof commentinfo.body !== 'string'){
    return Promise.reject({status :400,msg: 'Bad Request'})
  }
  if ( (await db.query("SELECT username FROM users WHERE username = $1", [ commentinfo.username,])).rows.length === 0) {
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
// make this simpler at some point copy the method used for the updatecommentvotes
async updateArticle(adjustVotes, article_id) {
  
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
 
  const output = await db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,[adjustedVotes,article_id])
  
  return output.rows[0];

}

async removeArticle(articleId){
  const {rows} = await db.query(`DELETE FROM articles where article_id = $1 RETURNING *`,[articleId])
   return rows.length === 0 ?  Promise.reject({status:404, msg: 'Article doesnt exist'}) : rows 
 }

 async insertArticles(articleData){
  //have to check if topic is in topics database first
  const topics = await db.query('SELECT slug FROM topics') 
  if(!topics.rows.some((topic)=> topic.slug === articleData.topic)){
    return Promise.reject({status:404, msg: 'topic not found in topics database make a post request to topics first'})
  }
  articleData.article_img_url = articleData.article_img_url || `https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700`
  const {rows} = await db.query('INSERT INTO articles (title,topic,author,body,article_img_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',[articleData.title,articleData.topic,articleData.author,articleData.body,articleData.article_img_url])
  return rows[0]
}
}

class TopicsModel{
  
  async insertTopic(newTopic){
    const {rows} = await db.query(`INSERT INTO topics (slug,description) VALUES ($1,$2) RETURNING *`, [newTopic.slug,newTopic.description])
    return rows[0]
   }
   async selectTopics() {
    const { rows } = await db.query("SELECT * FROM topics ");
    return rows;
  }
}

class CommentsModel{
  async updateCommentVotes(commentId,changeVotes){
   
    const{rows} = await db.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *',[changeVotes,commentId])
    
    return rows.length === 0 ?  Promise.reject({status:404, msg: 'Comment doesnt exist'}) : rows[0]
  }

  async removeComment(commentId){


    const {rows}= await db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *',[commentId])
   return rows.length === 0 ?  Promise.reject({status:404, msg: 'Comment doesnt exist'}) : rows 

}

}

class UsersModel {
  async selectUsers(){
    const {rows} = await db.query('SELECT username,name, avatar_url FROM users')
    return rows

}
async selectUserByName(username){
  const {rows}= await db.query('SELECT username, avatar_url, name FROM users WHERE username = $1',[username])
  return rows.length === 0 ?  Promise.reject({status:404, msg: 'User doesnt exist'}) : rows[0]
}
}


async function selectApi() {
  const apidata = await fs.readFile(`${__dirname}/../endpoints.json`);
  return JSON.parse(apidata);
}

module.exports = {
  selectApi,
  UsersModel,
  CommentsModel,
  TopicsModel,
  ArticlesModel
};

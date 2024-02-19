const { log } = require("console");
const db = require("../db/connection");
const fs = require("fs/promises");
async function checkIfIdExists(table, key, id) {
  const { rows } = await db.query(`SELECT * FROM ${table} WHERE ${key} =  $1`, [
    id,
  ]);
  return rows.length > 0
    ? rows[0]
    : Promise.reject({ status: 404, msg: "Article Id does not exist" });
}

async function selectTopics() {
  const { rows } = await db.query("SELECT * FROM topics ");

  return rows;
}
async function selectApi() {
  const apidata = await fs.readFile(`${__dirname}/../endpoints.json`);

  return JSON.parse(apidata);
}
async function selectArticle(articleId) {
  //const {rows} = await db.query('SELECT * FROM articles WHERE article_id = $1',[articleId])
  return checkIfIdExists("articles", "article_id", articleId);
}
async function selectAllArticles() {
  const { rows } =
    await db.query(`SELECT articles.author,title,articles.article_id,topic,articles.created_at,articles.votes,article_img_url,COUNT(comments.comment_id) AS comment_count 
    FROM articles
    JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
     `);
  return rows;
}

async function selectCommentsByArticle(article_id) {
  const { rows } = await db.query(
    `SELECT comments.comment_id,comments.votes,comments.created_at,comments.author,comments.body,comments.article_id 
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1`,
    [article_id]
  );

  return rows.length > 0
    ? rows
    : Promise.reject({
        status: 404,
        msg: "Comments with this Article Id dont exist",
      });
}
async function insertComment(commentinfo, articleId) {
  try {
    if (
      (
        await db.query("SELECT * FROM articles WHERE article_id = $1", [
          articleId,
        ])
      ).rows.length === 0
    ) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    if (JSON.stringify(Object.keys(commentinfo)) !== '["username","body"]') {
      return Promise.reject({
        status: 400,
        msg: "Bad Request: Incorrect format for comment",
      });
    }
    if (
      typeof commentinfo.username !== "string" ||
      typeof commentinfo.body !== "string"
    ) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request: Incorrect format for comment",
      });
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
    (author,body,article_id,created_at,votes)
    VALUES
    ($1,$2,$3,CURRENT_TIMESTAMP,$4)
    RETURNING *`,
      [commentinfo.username, commentinfo.body, articleId, 0]
    );
    return rows[0];
  } catch (error) {}
}

async function updateArticle(adjustVotes, article_id) {
 
    
    console.log(article_id)
    console.log(typeof adjustVotes !== 'number')
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
async function removeComment(articleId){
    await db.query('DELETE FROM articles WHERE article_id = $1',[articleId])

}
module.exports = {
  selectTopics,
  selectApi,
  selectArticle,
  selectAllArticles,
  selectCommentsByArticle,
  insertComment,
  updateArticle,
  removeComment
};

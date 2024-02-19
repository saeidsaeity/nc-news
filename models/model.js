const db = require('../db/connection');
const fs = require('fs/promises');
    async function checkIfIdExists(table,id,key){
        const {rows}= await db.query(`SELECT * FROM ${table} WHERE ${key} =  ${id} `)
        return rows.length > 0


    }
    async function selectTopics(){
       
        const {rows} = await db.query('SELECT * FROM topics ')
      
        return rows


    }
    async function selectApi(){
        const apidata = await fs.readFile(`${__dirname}/../endpoints.json`)
        
        return JSON.parse(apidata)
        

    }
   async function selectArticle(articleId){
    if(await checkIfIdExists('articles',articleId,'article_id')){
    const {rows} = await db.query('SELECT * FROM articles WHERE article_id = $1',[articleId])
    return rows[0]
    }
    else{
        return Promise.reject({status:404, msg: "Article Id does not exist"})
    }

   }

module.exports = {
    selectTopics,
    selectApi,
    selectArticle
};

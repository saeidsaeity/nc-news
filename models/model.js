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


module.exports = {
    selectTopics,
    selectApi
};

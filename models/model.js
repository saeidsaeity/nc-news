const db = require('../db/connection');

    async function selectTopics(){
       
        const {rows} = await db.query('SELECT * FROM topics ')
      
        return rows


    }


module.exports = {
    selectTopics
};

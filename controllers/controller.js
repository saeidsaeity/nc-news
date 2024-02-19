const {selectTopics} = require('../models/model');

   
    async function getTopics(req,res,next) {
        try{
      
  
        const topicsdata = await selectTopics()
        res.status(200).send(topicsdata)
        }
        catch(error){console.log(error)}
        
        
    }


module.exports = {getTopics}
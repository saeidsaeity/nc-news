const {selectTopics,selectApi} = require('../models/model');

   
    async function getTopics(req,res,next) {
        try{
      
  
        const topicsdata = await selectTopics()
        res.status(200).send(topicsdata)
        }
        catch(error){console.log(error)}
        
        
    }
    async function getApi(req,res,next) {
        try{
        const apiData = await selectApi()
        res.status(200).send(apiData)

        }
        catch(error){
            console.log(error)

        }
        
    }


module.exports = {getTopics,getApi}
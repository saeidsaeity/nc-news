const express = require('express');
const {getTopics} = require('./controllers/controller')
const app = express()


app.get('/api/topics',getTopics)
module.exports = app
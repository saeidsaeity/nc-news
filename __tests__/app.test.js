const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");



beforeEach(() => seed(testData));
afterAll(() => db.end());
describe('Tests for /api/topics', () => {
    test('gets 200', async () => {
    const { body } = await request(app).get('/api/topics').expect(200);
    console.log(body)
    body.forEach((topic)=>{
    expect(typeof topic.slug).toEqual('string');
    expect(typeof topic.description ).toEqual('string')
})
    })
    
});

describe('test for /api endpoint', () => {
    test('gets 200', async () => {
    const {body}  = await request(app).get('/api').expect(200);
    const expected = {
        "GET /api": {
          "description": "serves up a json representation of all the available endpoints of the api"
        },
        "GET /api/topics": {
          "description": "serves an array of all topics",
          "queries": [],
          "exampleResponse": {
            "topics": [{ "slug": "football", "description": "Footie!" }]
          }
        },
        "GET /api/articles": {
          "description": "serves an array of all articles",
          "queries": ["author", "topic", "sort_by", "order"],
          "exampleResponse": {
            "articles": [
              {
                "title": "Seafood substitutions are increasing",
                "topic": "cooking",
                "author": "weegembump",
                "body": "Text from the article..",
                "created_at": "2018-05-30T15:59:13.341Z",
                "votes": 0,
                "comment_count": 6
              }
            ]
          }
        }
      }
    expect(body).toMatchObject(expected)
    })
    
});
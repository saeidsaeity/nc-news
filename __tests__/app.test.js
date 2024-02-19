const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const fs = require('fs/promises');
beforeEach(() => seed(testData));
afterAll(() => db.end());
describe("Tests for /api/topics", () => {
  test("gets 200", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body.topics.length).not.toBe(0);
    body.topics.forEach((topic) => {
      expect(typeof topic.slug).toEqual("string");
      expect(typeof topic.description).toEqual("string");
    });
  });
});

describe("test for /api endpoint", () => {
  test("gets 200", async () => {
    const { body } = await request(app).get("/api").expect(200);
    const expected = await JSON.parse(await fs.readFile(`${__dirname}/../endpoints.json`))
  
    expect(body).toMatchObject(expected);
  });
});
describe("tests for /api/articles/:article_id endpoint ", () => {
  test("gets 200 for /api/articles/article_id", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    const expectoutput =  {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
    expect(body.article).toMatchObject(expectoutput)
  });
  test('gets 404 when an article id doesnt exist ', async () => {
  const  {body}  = await request(app).get('/api/articles/1000').expect(404);
    expect(body.msg).toEqual('Article Id does not exist');
  })
  test('gets 400 when given invalid id', async () => {
  const { body } = await request(app).get('/api/articles/invalid').expect(400);
  
  expect(body.msg).toEqual('Bad Request')
  })
});

describe('tests for /api/articles endpoint ', () => {
    test('gets 200', async () => {
    const { body } = await request(app).get('/api/articles').expect(200);
    expect(body.articles).not.toEqual(0);
    body.articles.forEach((article)=>{
        expect(article).toMatchObject({
            author : expect.any(String),
            title : expect.any(String),
            article_id : expect.any(Number),
            topic : expect.any(String),
            created_at : expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String)

        })
    })
    expect(body.articles).toBeSortedBy('created_at',{descending : true})
  
    })
    
});
describe('/api/articles/:article_id/comments endpoint', () => {
    
    test('gets 200', async () => {
    const { body } = await request(app).get('/api/articles/3/comments').expect(200);
    expect(body.comments.length).not.toEqual(0);
    body.comments.forEach((comment)=> {
        expect(comment).toMatchObject({
        comment_id:expect.any(Number),
        votes:expect.any(Number),
        created_at:expect.any(String),
        author:expect.any(String),
        body:expect.any(String),
        article_id:expect.any(Number)

        })
    })

    })
    test('gets 404 when an article id doesnt exist or article doesnt have comments', async () => {
    const { body } = await request(app).get('/api/articles/1000/comments').expect(404);
    expect(body.msg).toEqual('Comments with this Article Id dont exist')
    })
    test('gets 400 when a bad request is made', async () => {
    const { body } = await request(app).get('/api/articles/banana/comments').expect(400);
    expect(body.msg).toEqual('Bad Request');
    })
    describe('POST /api/articles/:article_id/comments endpoint', () => {
    test('POST 201', async () => {
    const data = {username: 'icellusedkars',body:"great article very informative"}
    const { body } = await request(app).post('/api/articles/2/comments').send(data).expect(201);
    expect(body.comment).toMatchObject({
        comment_id: 19,
        body: 'great article very informative',
        article_id: 2,
        author: 'icellusedkars',
        votes: 0,
        created_at: expect.any(String)
      })
    })

    test('POST 404 username doesnt exist ', async () => {
        const data = {username: 'progamer585390485930',body:"great article very informative"}
        const { body } = await request(app).post('/api/articles/2/comments').send(data).expect(404);
        expect(body.msg).toEqual('username doesnt exist create a profile first before commenting');
        })
    test('POST 400 incorrect data format', async () => {
            const data = {user:6643 , likes: 'football'}
            const { body } = await request(app).post('/api/articles/2/comments').send(data).expect(400);
            })

    test('POST 404 article not found', async () => {
    const data = {username: 'icellusedkars',body:"great article very informative"}
    const { body } = await request(app).post('/api/articles/10000/comments').send(data).expect(404);
    expect(body.msg).toEqual('Article not found');
    })
    test('POST 400 incorrect data format', async () => {
        const data = {username: 100000,body:23}
        const { body } = await request(app).post('/api/articles/2/comments').send(data).expect(400);
        
        })






    });
    
   
});


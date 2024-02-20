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
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: expect.any(String)
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


  describe('Patch tests for /api/articles/:article_id endpoint', () => {
    test('Patch 200', async () => {
    const data = { inc_votes : 10000 }
    const { body } = await request(app).patch('/api/articles/4').send(data).expect(200);

        expect(body.article).toMatchObject({
            article_id: 4,
            title: 'Student SUES Mitch!',
            topic: 'mitch',
            author: 'rogersop',
            body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
            created_at: expect.any(String),
            votes: 10000,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          })
    })
    test('Patch 200', async () => {
        const data = { inc_votes : -10}
        const { body } = await request(app).patch('/api/articles/4').send(data).expect(400);
        expect(body.msg).toBe("Bad Request votes cant go below zero");
    })
    test('Patch 200', async () => {
    const data =  { inc_votes : 10}
    const { body } = await request(app).patch('/api/articles/100').send(data).expect(404);
    expect(body.msg).toBe("article doesnt exist");
    })
    test('Patch 200', async () => {
    const data = { inc_votes : 'dwwad'}
    const { body } = await request(app).patch('/api/articles/4').send(data).expect(400);
    expect(body.msg).toBe('Bad Request incorrect format');
    })
    test('Patch 200', async () => {
        const data = { inc_votes : 10 }
    const { body } = await request(app).patch('/api/articles/wadiodwajio').send(data).expect(400);
    expect(body.msg).toBe('Bad Request');
    })



  });

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
    test('gets specific topic returns 200', async () => {
    const { body } = await request(app).get('/api/articles?topic=cats').expect(200);

    expect(body.articles[0]).toMatchObject({
        article_id: 5,
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: expect.any(String),
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      })
    })
    test('gets 404 when given a topic that doesnt exist', async () => {
    const { body } = await request(app).get('/api/articles?topic=iioipkl').expect(404);
    expect(body.msg).toEqual("Query not found");
    })
    test('gets 400 for bad query', async () => {
    const { body } = await request(app).get('/api/articles?waduhwa=brudawe3').expect(400)
    expect(body.msg).toEqual("Bad Query");
    ;
    })


//here




    
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
    test('gets 404 when an article id doesnt exist', async () => {
    const { body } = await request(app).get('/api/articles/1000/comments').expect(404);
    expect(body.msg).toEqual('Article Id doesnt exist')
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
describe('/api/comments/:comment_id', () => {

    describe('DELETE 204 /api/comments/:comment_id ', () => {
        test('Delete 204', async () => {
       
         await request(app).delete('/api/comments/2').expect(204);
        })
    test('Delete 404 when given a comment id that doesnt exist', async () => {
     await request(app).delete('/api/comments/10000').expect(404);
     
    })
    test('Delete 400 invalid request', async () => {
     await request(app).delete('/api/comments/banana').expect(400);
    })
        
    });
    
});

describe('/api/users', () => {
    test('gets 200', async () => {
    const { body } = await request(app).get('/api/users').expect(200);
        body.users.forEach((user)=>{
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url : expect.any(String)
            })})

    })
    
});


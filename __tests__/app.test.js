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
    const data =  { inc_votes : 10}
    const { body } = await request(app).patch('/api/articles/100').send(data).expect(404);
    expect(body.msg).toBe("article doesnt exist");
    })
    test('Patch 200', async () => {
    const data = { inc_votes : 'dwwad'}
    const { body } = await request(app).patch('/api/articles/4').send(data).expect(400);
    expect(body.msg).toBe('Bad Request');
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
describe('tests for /api/articles Queries advance', () => {
  test('gets 200 for sort_by', async () => {
  const { body } = await request(app).get('/api/articles?sort_by').expect(200);
  
  expect(body.articles).toBeSortedBy('created_at',{descending : true})
  })
  test('gets 200 for sort_by = commnet_count', async () => {
    const { body } = await request(app).get('/api/articles?sort_by=comment_count').expect(200);
  
    expect(body.articles).toBeSortedBy('comment_count',{descending : true,coerce:true})
    
    })
  test('gets 200 for sort_by=comment_countorder =asc ', async () => {
  const { body } = await request(app).get('/api/articles?sort_by=comment_count&order=asc').expect(200);
  expect(body.articles).toBeSortedBy('comment_count',{descending : false,coerce:true})
  })
  test('gets 400 for sort_by=comment_countorder=aawdwad', async () => {
  const { body } = await request(app).get('/api/articles?sort_by=comment_count&order=wadawd').expect(400);
  expect(body.msg).toEqual("Bad Request");
  })
  test('gets 400 bad query', async () => {
  const { body } = await request(app).get('/api/articles?sort_by=commnt&order=asc').expect(400);
  expect(body.msg).toEqual("Bad Request");
  })
});

//here
    describe('ADVANCED QUERIES with page limits', () => {
      test('gets 200 when sent topic amd limit query query', async () => {
      const { body } = await request(app).get('/api/articles?topic=mitch&limit=2&p=1').expect(200);
      
      expect(body.articles.length).not.toEqual(0);
      body.articles.forEach((article)=> expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      }))

      expect(body.total_count).toEqual(12);
      })
      test('gets 200 when sent sort_by amd limit query query', async () => {
        const { body } = await request(app).get('/api/articles?sort_by=author&limit=2&p=1').expect(200);
        
        expect(body.articles.length).not.toEqual(0);
      
        body.articles.forEach((article)=> expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        }))
 
        expect(body.total_count).toEqual(13);
        })
        test('gets 404 when page doesnt exist', async () => {
        const { body } = await request(app).get('/api/articles?sort_by=author&limit=10&p=4').expect(404);
       expect(body.msg).toEqual('Query not found');

        })
        test('gets 200 when given limit larger than total_count', async () => {
        const { body } = await request(app).get('/api/articles?sort_by=author&limit=100&p=1').expect(200);
        body.articles.forEach((article)=> expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        }))
        
        })
        test('gets 200', async () => {
        const { body } = await request(app).get('/api/articles?limit=100&p=1').expect(200);
        body.articles.forEach((article)=> expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        }))

        })
    });

describe('POST /api/articles', () => {
  test('POST 201', async () => {
  const data = {
  title: "Living in the shadow of a great man",
  topic: "paper",
  author: "butter_bridge",
  body: "I find this existence challenging",
 
  article_img_url:
    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"}
  const { body } = await request(app).post('/api/articles').send(data).expect(201);
 
  expect(body.article).toMatchObject(
      {
        article_id: 14,
        title: 'Living in the shadow of a great man',
        topic: 'paper',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: expect.any(String),
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }

    
  )
  })
  test('Post 201 when not given url', async () => {
    const data = {
      title: "Living in the shadow of a great man",
      topic: "paper",
      author: "butter_bridge",
      body: "I find this existence challenging",
     
    }
      const { body } = await request(app).post('/api/articles').send(data).expect(201);
      expect(body.article).toMatchObject(
          {
            article_id: 14,
            title: 'Living in the shadow of a great man',
            topic: 'paper',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 0,
            article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
          }
    
        
      )
    
  });
  test('POST 400 when given wrong format', async () => {
  const data = {
    titles: 12,
    topic: "paper",
    authors: "butter_bridge",
    body: "I find this existence challenging",
    created_at: 1594329060000,
    votes: 100
  }
  const { body } = await request(app).post('/api/articles').send(data).expect(400);
 expect(body.msg).toEqual('Bad Request');
  })


  test('POST 201 when given extra data', async () => {
  const data =  {
  article_id: 14,
  title: 'Living in the shadow of a great man',
  topic: 'paper',
  author: 'butter_bridge',
  body: 'I find this existence challenging',
  created_at: expect.any(String),
  votes: 0,
  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
  article_meta_data:'w=500 h=5000'
}
  const { body } = await request(app).post('/api/articles').send(data).expect(201);
  expect(body.article).toMatchObject({ article_id: 14,
    title: 'Living in the shadow of a great man',
    topic: 'paper',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: expect.any(String),
    votes: 0,
    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"})
  })
});
test('POST 404 when topic doesnt exist', async () => {
  const data =  {
    article_id: 14,
    title: 'Living in the shadow of a great man',
    topic: 'football',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: expect.any(String),
    votes: 0,
    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
    article_meta_data:'w=500 h=5000'
  }
const { body } = await request(app).post('/api/articles').send(data).expect(404);
expect(body.msg).toEqual("topic not found in topics database make a post request to topics first");
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
    test('gets 404 when an article id doesnt exist', async () => {
    const { body } = await request(app).get('/api/articles/1000/comments').expect(404);
    expect(body.msg).toEqual('Article Id doesnt exist')
    })
    test('gets 400 when a bad request is made', async () => {
    const { body } = await request(app).get('/api/articles/banana/comments').expect(400);
    expect(body.msg).toEqual('Bad Request');
    })

    describe('ADVANCED api/articles/:article_id/comments endpoint', () => {
      test('gets 200', async () => {
      const { body } = await request(app).get('/api/articles/3/comments?limit=10&p=1').expect(200);
      expect(body.comments.length).toEqual(2);
      
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
      test('gets 200 for page 2', async () => {
        const { body } = await request(app).get('/api/articles/3/comments?limit=1&p=2').expect(200);
        expect(body.comments.length).toEqual(1);
        expect(body.total_count).toEqual(2)
        
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
        test('gets 200 when page count doesnt have comments', async () => {
        const { body } = await request(app).get('/api/articles/3/comments?limit=1&p=7').expect(200);
        expect(body.comments.length).toEqual(0);
        })
      test('gets 400 for bad page request', async () => {
      const { body } = await request(app).get('/api/articles/3/comments?limit=1&p=burger').expect(400);
      expect(body.msg).toEqual('Bad Request');
      })
      test('gets 400 for bad page limit ', async () => {
      const { body } = await request(app).get('/api/articles/3/comments?limit=burger&p=2').expect(400);
      expect(body.msg).toEqual('Bad Request');
      })
      test('gets 200 limit defaults to 10 when limit isnt passed a number', async () => {
      const { body } = await request(app).get('/api/articles/1/comments?limit&p=1').expect(200);
      expect(body.comments.length).toEqual(10);

      })
    });


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
    test('POST 400 for invalid format', async () => {
            const data = {user:6643 , likes: 'football'}
            const { body } = await request(app).post('/api/articles/2/comments').send(data).expect(400);
            })
    test('POST 201 even when given uncessary properties', async () => {
    const data = {username: 'icellusedkars',body:"great article very informative",likes:'football'}
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
    test('POST 400 invalid id ', async () => {
    const data = {}
    const { body } = await request(app).post('/api/articles/notanid/comments').send(data).expect(400);
    expect(body.msg).toEqual('Bad Request');
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

    describe('Patch tests for /api/comments/:comment_id', () => {
      test('Patch 200', async () => {
      const data = {inc_votes: 100}
      const { body } = await request(app).patch('/api/comments/1').send(data).expect(200);
      
      expect(body.comment).toMatchObject({
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: 'butter_bridge',
        votes: 116,
        created_at: expect.any(String)
      })
      })
      
      test('Patch 400 bad request', async () => {
      const data = {inc_votes: 'pineapple'}
      const { body } = await request(app).patch('/api/comments/1').send(data).expect(400);
      expect(body.msg).toEqual('Bad Request');
      })
     test('Patch 200 when given un needed data', async () => {
     const data = {inc_votes: 5 , date:"1985"}
     const { body } = await request(app).patch('/api/comments/1').send(data).expect(200);
     expect(body.comment).toMatchObject({
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9,
      author: 'butter_bridge',
      votes:21,
      created_at: expect.any(String)
    })
  })
    test('Patch 404 when comment doesnt exist', async () => {
    const data = {inc_votes: 5}
    const { body } = await request(app).patch('/api/comments/300').send(data).expect(404);
    expect(body.msg).toEqual('Comment doesnt exist');
    })
     
    });
    
});





describe('/api/users', () => {
    test('gets 200', async () => {
    const { body } = await request(app).get('/api/users').expect(200);
        expect(body.users.length).not.toEqual(0);
        
        body.users.forEach((user)=>{
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url : expect.any(String)
            })})

    })
    
});

describe('/api/users/:username', () => {
  test('gets 200 when request sent to /api/users/:username', async () => {
  const { body } = await request(app).get('/api/users/butter_bridge').expect(200);
  expect(body.user).toMatchObject({username: 'butter_bridge',
  avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
  name: 'jonny'})
  })
  test('gets 404 when username doesnt exist', async () => {
  const { body } = await request(app).get('/api/users/spaceinvader').expect(404);
  expect(body.msg).toEqual('User doesnt exist');
  })

  
});
describe('post /API/TOPICS', () => {
  test('POST 201', async () => {
  const data = {
    "slug": "topic name here",
    "description": "description here"
  }
  const { body } = await request(app).post('/api/topics').send(data).expect(201);
  expect(body.topic).toMatchObject({
    "slug": "topic name here",
    "description": "description here"
  })
  })
  test('POST 201', async () => {
  const data = {
    "slugs": "topic name here",
    "descriptions": "description here"
  }
  const { body } = await request(app).post('/api/topics').send(data).expect(400)
  expect(body.msg).toEqual('Bad Request');
 
  })
});
describe('delete /api/articles/:article_id', () => {
  test('Delete 204', async () => {
   await request(app).delete('/api/articles/2').expect(204);
  })
  test('Delete 204', async () => {
   const {body} = await request(app).delete('/api/articles/111').expect(404);
   expect(body.msg).toEqual('Article doesnt exist');
  })
  
});
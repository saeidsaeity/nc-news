const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");

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
    const expected = {
      "GET /api": {
        description:
          "serves up a json representation of all the available endpoints of the api",
      },
      "GET /api/topics": {
        description: "serves an array of all topics",
        queries: [],
        exampleResponse: {
          topics: [{ slug: "football", description: "Footie!" }],
        },
      },
      "GET /api/articles": {
        description: "serves an array of all articles",
        queries: ["author", "topic", "sort_by", "order"],
        exampleResponse: {
          articles: [
            {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: "2018-05-30T15:59:13.341Z",
              votes: 0,
              comment_count: 6,
            },
          ],
        },
      },
    };
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

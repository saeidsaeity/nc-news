const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");


beforeEach(() => seed(testData));
afterAll(() => db.end());
describe('', () => {
    test('gets 200', async () => {
    const { body } = await request(app).get('/api/topics').expect(200);
    console.log(body)
    body.forEach((topic)=>{
    expect(typeof topic.slug).toEqual('string');
    expect(typeof topic.description ).toEqual('string')
})
    })
    
});
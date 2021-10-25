const { response } = require('express');
const supertest = require('supertest');
const app = require('../server.js')

// root should recieve a 200 status code ✅
// webhook should recieve a 200 status code ✅
// it should lookout for bad input from the webhook
// it should lookout to see if webhook is set 
// it should test for internet connection 
// it should test for latency 
// it should test for internet throttling
// it should do A retry if the que orders get tied up 
// it should test to see if customer gets deleted 
// it should handle 404
// it shoyld handle 400
// it should handle 504 

// Use exponential backoff (use timeout for this)
// 10 sec run API
// 20 sec run API
// 30 sec run API

describe('Get endpoint', function() {
    test('should create webhook and return an 200 status', async () => {
        const response = await supertest(app).get('/')
        expect(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                webhook: expect.objectContaining({
                    address: expect.any(String), 
                    id: expect.any(Number),
                    topic: expect.stringContaining('subscription/cancelled'),
                    version: expect.any(String)
                })
            })
        )
    })
});

// describe('Unit test the post endpoint', function() {
    
//     it('should return an ok status', function() {
//         return request(app)
//         .post('/subscription/webhook')
//         .then(function(response) {
//             assert.equal(response.status, 200)
//         })
//     });
// })





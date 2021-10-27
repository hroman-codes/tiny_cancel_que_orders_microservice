const { response } = require('express');
const supertest = require('supertest');
const app = require('../server.js')

// root should recieve a 200 status code ✅
// webhook should recieve a 200 status code ✅
// it should lookout to see if webhook is set / bad input from the webhook ✅
// it should test to see if customer exist ✅
// it should handle 404 Not Found
// it should hanlde 502 Bad Gateway
// it should handle 500 Internal Server Error 
// it should test for latency 
// it should test for internet throttling
// it should do A retry if the que orders get tied up 

// Use exponential backoff (use timeout for this)
// 10 sec run API
// 20 sec run API
// 30 sec run API

describe('GET endpoint', function() {

    test('respond with 200 status code, should specify json content', 'should create a subscription/cancelled webhook', async () => {
        const response = await supertest(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
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

describe('POST endpoint', function() {
    
    test('should return an 200 status', async function() {
        const response = await supertest(app).post('/subscription/webhook')
        expect(response.statusCode).toBe(200)
    });

    test('should test to see if customer account is deleted', async () => {
        const response = await supertest(app).post('/subscription/webhook').send({ 
            customer_id: 1,
        })
        expect(response.body.customer_id).toBeDefined()
    });

})

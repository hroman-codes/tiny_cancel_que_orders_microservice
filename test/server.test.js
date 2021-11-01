const { response, request } = require('express');
const supertest = require('supertest');
const app = require('../server.js');
import 'regenerator-runtime/runtime'
import mockAxios from 'axios';

jest.mock('axios');

describe('GET endpoint', function() {

    test('respond with 200 status code, should specify json content, should create a subscription/cancelled webhook', async () => {
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

    beforeEach(() => {
        jest.clearAllMocks();
    })
    
    test('should return an 200 status', async () => {
        const response = await supertest(app).post('/subscription/webhook')
        expect(response.statusCode).toBe(200)
    });

    test('should handle 404 HTTP error code', async () => {
        const response = await supertest(app).post('/subscription/webhook')
        expect(response.statusCode).not.toBe(404)
    })

    // Attempt 1
    test('mock axios call to POST API', async () => {
        // setup
       mockAxios.get.mockImplementationOnce(() => Promise.resolve({
            data: {     
                "customer_id": 1, 
                "status": "Active" 
            }
        }))
        
        // work
        const response = await supertest(app).post('/subscription/webhook')

        // assertions
        expect(response.statusCode).toBe(200);
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith(`https://api.rechargeapps.com/subscriptions?customer_id=1&status=ACTIVE`, 
            {
                "headers": {"Accept": "application/json; charset=utf-8;", 
                "Content-Type": "application/json", 
                "X-Recharge-Access-Token": process.env.RECHARGE_API_KEY
            }
        })
    })

})
 
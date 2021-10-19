const assert = require('assert')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../server.js')

describe('Unit test the get endpoint', function() {

    it('should return an ok status', function() {
        return request(app)
        .get('/')
        .then(function(response) {
            assert.equal(response.status, 200)
        })
    });
});

describe('Unit test the post endpoint', function() {
    
    it('should return an ok status', function() {
        return request(app)
        .post('/subscription/webhook')
        .then(function(response) {
            assert.equal(response.status, 200)
        })
    });
})

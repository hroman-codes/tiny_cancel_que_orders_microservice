const assert = require('assert')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../server.js')

describe('Unit testing the / route', function() {

    it('should return an ok status', function() {
        return request(app)
        .get('/')
        .then(function(response) {
            assert.equal(response.status, 200)
        })
    });

    it('should return message on rendering', function() {
        return request(app)
        .get('/')
        .then(function(response) {
            expect(response.text).to.contain('GET')
        })
    });
    
});

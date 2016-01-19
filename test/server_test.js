'use strict';
var chai    = require('chai');
var expect  = chai.expect;
var request = require('supertest');
var server  = require('../server.js');

describe('server.js', function () {
  it('GET "/" should return a 200 response', function (done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('GET "/notarealpage" should return a 404 response', function (done) {
    request(server)
      .get('/notarealpage')
      .expect(404, done);
  });

});


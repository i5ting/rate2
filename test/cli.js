var supertest = require('supertest')
var chai = require('chai')
var expect = chai.expect;
var assert = chai.assert;

const request = require('supertest');
const express = require('express');

const app = express();

var rate = request('../')

app.get('/user', function (req, res) {
    res.status(200).json({ name: 'tobi' });
});

describe('cli', function () {
    it('should return -1 when the value is not present', function (done) {
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});


describe('express', function () {
    it('should return -1 when the value is not present', function (done) {
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
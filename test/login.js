const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiMatchPattern = require('chai-match-pattern');
const _ = chaiMatchPattern.getLodashModule();
const User = require('../db/models/user');
const server = require('../app');
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiMatchPattern);

describe('LOGIN', () => {
  beforeEach(done => {
    User.create({
      userid: 273498,
      username: '273498',
      password: '273498'
    });
    done();
  });

  afterEach(done => {
    User.destroy({
      where: {
        username: '273498'
      }
    });
    done();
  });

  it('LOGIN CORRECT DATA 200', done => {
    chai.request('http://localhost:3000')
      .post('/login')
      .type('form')
      .set('content-type', 'application/json')
      .send({
        username: '273498',
        password: '273498'
      })
      .end((error, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.matchPattern({
          userid: 273498,
          username: '273498',
          token: _.isString });
        done();
      });
  });

  it('LOGIN INCORRECT DATA 400', done => {
    chai.request('http://localhost:3000')
      .post('/login')
      .type('form')
      .set('content-type', 'application/json')
      .send({
        username: 'FALSE',
        password: '273498'
      })
      .end((error, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.matchPattern({
          success: false,
          message: 'User does not exist or password is incorrect' });
        done();
      });
  });

  it('LOGIN INCORRECT DATA 400', done => {
    chai.request('http://localhost:3000')
      .post('/login')
      .type('form')
      .set('content-type', 'application/json')
      .send({
        username: '273498',
        password: 'FALSE'
      })
      .end((error, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.matchPattern({
          success: false,
          message: 'User does not exist or password is incorrect' });
        done();
      });
  });
});

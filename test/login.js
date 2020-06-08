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
      userid: 1948560,
      username: '1948560',
      password: '1948560'
    });
    done();
  });

  afterEach(done => {
    User.destroy({
      where: {
        username: '1948560'
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
        username: '1948560',
        password: '1948560'
      })
      .end((error, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.matchPattern({
          userid: 1948560,
          username: '1948560',
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
        password: '1948560'
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
        username: '1948560',
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

const chai = require('chai')
const chaiHttp = require('chai-http')
const User = require('../db/models/user')
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');

const expect = chai.expect;

chai.use(chaiHttp)

describe('JWT', () => {
    let token = '';

    beforeEach(async () => {
        await User.create({
            username:'847382',
            password:'847382',
            userid: 847382    
        });
        
        testToken = await jwt.sign({
            userid: 847382,
            username: '847382'
          }, jwtSecret.secret)
    })

    afterEach(done => {
        User.destroy({
            where:{
                username:'847382'
            }
        })
        done();
    })

    it('INVALID TOKEN 401', done => {
        chai.request('http://localhost:3000')
        .get('/api/forms')
        .set("Authorization", "invalid token")
        .end((error, res) => {
            expect(res).to.have.status(401);
            done();
        })
    })
})
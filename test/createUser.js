const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect;

const User = require('../db/models/user');

chai.use(chaiHttp)


describe('SUCCESS CREATE USER', () => {

    after(done => {
        User.destroy({
            where:{
                userid: 850989
            }
        })

        done();
    })

    it('CREATE USER 200', done => {
        chai.request('http://localhost:3000')
        .put('/api/form/850989/comment')
        .send({
            username: "850989",
            password: "850989",
            userid: 850989
        })
        .end((error, res) => {
            expect(res).to.have.status(200)
            done();
        })
    })

})

describe('SUCCESS CREATE USER', () => {

    before(async () => {
        const testUser = await User.create({
            username:'850989',
            password:'850989',
            userid: 850989    
        });
    })

    after(done => {
        User.destroy({
            where:{
                userid: 850989
            }
        })

        done();
    })

    it('CREATE USER 400', done => {
        chai.request('http://localhost:3000')
        .put('/api/form/850989/comment')
        .send({
            username: "850989",
            password: "850989",
            userid: 850989
        })
        .end((error, res) => {
            expect(res).to.have.status(400)
            done();
        })
    })

})

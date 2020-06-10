const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiMatchPattern = require('chai-match-pattern');
const _ = chaiMatchPattern.getLodashModule();
const User = require('../db/models/user');
const Form = require('../db/models/form');
const server = require('../app');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiMatchPattern);

describe('GET FORM', () => {
    let testToken = '';

    beforeEach(async () => {
        const testUser = await User.create({
            username:'723874',
            password:'723874',
            userid: 723874    
        });

        testToken = await jwt.sign({
            userid: 723874,
            username: '723874'
          }, jwtSecret.secret)

        const testForm = await Form.create({
            formid: 723874,
            name: "mvlsd",
            surname: "ldslv",
            sex: "female",
            born: "2001-05-05",
            height: 30,
            phoneNumber: "23438",
            email: "kldslv@nvd.com",
            education: "primary",
            expectedSalary: 688,
            prefferedRegion: "mldslv",
            workExperience: 27,
            unemployedFor: 12,
            note: "sdv",
            professions:[{profession:"pit_boss"},{profession:"trainee"}],
            messengers: [{messenger:"Telegram", info:"pit_boss"},{messenger:"Viber", info:"dealer"}],
            languageSkills: [{language:"english", languageProficiency:"basic"},
                                {language:"russian",languageProficiency:"native"}]
        })
    })

    afterEach(done => {
        User.destroy({
            where:{
                userid: 723874
            }
        })

        Form.destroy({
            where:{
                formid:723874
            }
        })
        done();
    })

    it('GET FORM 200 BY ID', done => {
        chai.request('http://localhost:3000')
        .get('/form/723874')
        .set({ "Authorization": `Bearer ${testToken}` })
        .type('form')
        .set('content-type', 'application/json')
        .end((error, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('GET FORM 204 BY ID', done => {
        chai.request('http://localhost:3000')
        .get('/form/7238741')
        .set({ "Authorization": `Bearer ${testToken}` })
        .type('form')
        .set('content-type', 'application/json')
        .end((error, res) => {
            expect(res).to.have.status(204);
            done();
        })
    })
})
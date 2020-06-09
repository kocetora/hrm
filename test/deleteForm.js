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

describe('GET FORMS', () => {
    let testToken = '';

    before(async () => {
        const testUser = await User.create({
            username:'6561',
            password:'6561',
            userid: 6561    
        });

        testToken = await jwt.sign({
            userid: 6561,
            username: '6561'
          }, jwtSecret.secret)

        const testForm = await Form.create({
            formid: 6561,
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

    after(done => {
        User.destroy({
            where:{
                userid: 6561
            }
        })
        done();
    })

    it('DELETE FORM 200', done => {
        chai.request('http://localhost:3000')
        .delete('/form/6561')
        .set({ "Authorization": `Bearer ${testToken}` })
        .set('content-type', 'application/json')
        .type('form')
        .end((error, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })
})
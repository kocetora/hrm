const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');

const expect = chai.expect;

const User = require('../db/models/user');
const Form = require('../db/models/form');

chai.use(chaiHttp)

describe('GET FORM BY ID', () => {
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

        Form.destroy({
            where:{
                formid:6561
            }
        })
        done();
    })

    it('GET FORM 200 BY ID', done => {
        chai.request('http://localhost:3000')
        .get('/api/form/6561')
        .set({ "Authorization": `Bearer ${testToken}` })
        .send({})
        .end((error, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('GET FORM 204 BY ID', done => {
        chai.request('http://localhost:3000')
        .get('/api/form/843252')
        .set({ "Authorization": `Bearer ${testToken}` })
        .send({})
        .end((error, res) => {
            expect(res).to.have.status(204);
            done();
        })
    })
})
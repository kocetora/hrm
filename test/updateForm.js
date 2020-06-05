const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');

const expect = chai.expect;

const User = require('../db/models/user');
const Form = require('../db/models/form');

chai.use(chaiHttp)


describe('UPDATE FORM', () => {
    let testToken = '';

    beforeEach(async () => {
        const testUser = await User.create({
            username:'198325',
            password:'198325',
            userid: 198325    
        });

        testToken = await jwt.sign({
            userid: 198325,
            username: '198325'
          }, jwtSecret.secret)

        const testForm = await Form.create({
            formid: 198325,
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
                username: "198325"
            }
        })

        Form.destroy({
            where:{
                formid:198325
            }
        })
        done();
    })

    it('UPDATE FORM 200', done => {
        chai.request('http://localhost:3000')
        .put('/api/form/198325')
        .set({ "Authorization": `Bearer ${testToken}` })
        .send({
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
        .end((error, res) => {
            expect(res).to.have.status(200)
            done();
        })
    })

    it('UPDATE FORM BAD REQUEST 400', done => {
        chai.request('http://localhost:5000')
        .put('/api/form/198325')
        .set({ "Authorization": `Bearer ${testToken}` })
        .send({
            name: "mvlsd",
            surname: "ldslv",
            sex: "female",
            born: "2001-05-05",
            height: "sdvj",
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
        .end((error, res) => {
            expect(res).to.have.status(400)
            done();
        })
    })
})


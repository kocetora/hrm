const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect;

const Form = require('../db/models/form');

chai.use(chaiHttp)


describe('CREATE FORM', () => {

    before(async () => {
    })

    after(done => {

        Form.destroy({
            where:{
                formid:498025
            }
        })
        done();
    })

    it('CREATE FORM 200', done => {
        chai.request('http://localhost:3000')
        .post('/api/form')
        .send({
            formid: 498025,
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

    it('CREATE FORM BAD REQUEST 400', done => {
        chai.request('http://localhost:5000')
        .post('/api/form')
        .send({
            formid: 498025,
            name: "mvlsd",
            surname: "ldslv",
            sex: "female",
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


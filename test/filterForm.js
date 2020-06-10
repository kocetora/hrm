const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');

const expect = chai.expect;

const User = require('../db/models/user');
const Form = require('../db/models/form');

chai.use(chaiHttp)


describe('FILTER FORMS', () => {
    let testToken = '';

    beforeEach(async () => {
        const testUser = await User.create({
            username:'83930',
            password:'83930',
            userid: 83930    
        });

        testToken = await jwt.sign({
            userid: 83930,
            username: '83930'
          }, jwtSecret.secret)

        const testForm = await Form.create({
            formid: 83930,
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
                username: "83930"
            }
        })

        Form.destroy({
            where:{
                formid:83930
            }
        })
        done();
    })

    it('FILTER FORMS REQUEST 200', done => {
        chai.request('http://localhost:5000')
        .put('/api/forms/filter')
        .set({ "Authorization": `Bearer ${testToken}` })
        .send({
                sex: "male",
                education: "higher",
                age: [{from: "knv",to: "dfkv"}],
                workExperience: [{from: 0,to: 1211}],
                height: [{from: 30,to: 300}],
                expectedSalary: [{from: 1,to: 100000}],
                languageSkills: [{language: "russian", languageProficiency: "basic"}],
                professions: [
                    {profession: "trainee"},
                    {profession: "dealer"},
                    {profession: "inspector"},
                    {profession: "manager"},
                    {profession: "pit_boss"},
                    {profession: "waiter"},
                    {profession: "barman"}],
                messengers: [
                    {messenger: "Telegram"},
                    {messenger: "Viber"},
                    {messenger: "WhatsApp"}]
        })
        .end((error, res) => {
            expect(res).to.have.status(200)
            done();
        })
    })
})


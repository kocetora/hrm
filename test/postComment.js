const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiMatchPattern = require('chai-match-pattern');
const _ = chaiMatchPattern.getLodashModule();
const User = require('../db/models/user');
const Form = require('../db/models/form');
const Comment = require('../db/models/comment');
const server = require('../app');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiMatchPattern);

describe('CREATE COMMENT', () => {
  let testToken = '';

  before(async () => {
    const testUser = await User.create({
      username: '874329',
      password: '874329',
      userid: 874329
    });

    testToken = await jwt.sign({
      userid: 874329,
      username: '874329'
    }, jwtSecret.secret);

    const testForm = await Form.create({
      formid: 874329,
      name: 'mvlsd',
      surname: 'ldslv',
      sex: 'female',
      born: '2001-05-05',
      height: 30,
      phoneNumber: '23438',
      email: 'kldslv@nvd.com',
      education: 'primary',
      expectedSalary: 688,
      prefferedRegion: 'mldslv',
      workExperience: 27,
      unemployedFor: 12,
      note: 'sdv',
      professions: [{ profession: 'pit_boss' }, { profession: 'trainee' }],
      messengers: [{ messenger: 'Telegram', info: 'pit_boss' }, { messenger: 'Viber', info: 'dealer' }],
      languageSkills: [{ language: 'english', languageProficiency: 'basic' },
        { language: 'russian', languageProficiency: 'native' }]
    });
  });

  after(done => {
    User.destroy({
      where: {
        userid: 874329
      }
    });

    Form.destroy({
      where: {
        formid: 874329
      }
    });

    Comment.destroy({
      where: {
        commentid: 874329
      }
    });

    done();
  });

  it('CREATE COMMENT 200', done => {
    chai.request('http://localhost:3000')
      .post('/form/874329/comment')
      .set({ 'Authorization': `Bearer ${testToken}` })
      .type('form')
      .set('content-type', 'application/json')
      .send({
        userid: 874329,
        commentid: 874329,
        comment: 'djvwsv'
      })
      .end((error, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // it('CREATE COMMENT BAD REQUEST 400', done => {
  //     chai.request('http://localhost:3000')
  //     .post('/form/874329/comment')
  //     .set({ "Authorization": `Bearer ${testToken}` })
  //     .type('form')
  //     .set('content-type', 'application/json')
  //     .send({
  //         commentid: 874329,
  //         comment: "djvwsv"
  //     })
  //     .end((error, res) => {
  //         console.log(res.body)
  //         expect(res).to.have.status(400);
  //         done();
  //     })
  // })

  it('CREATE COMMENT BAD REQUEST 400', done => {
    chai.request('http://localhost:3000')
      .post('/form/874329/comment')
      .set({ 'Authorization': `Bearer ${testToken}` })
      .type('form')
      .set('content-type', 'application/json')
      .send({
        userid: 874329,
        commentid: 874329,
        comment: new Array(255 + 1).join('656')
      })
      .end((error, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});

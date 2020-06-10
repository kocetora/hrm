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

describe('GET COMMENT', () => {
  let testToken = '';

  before(async () => {
    const testUser = await User.create({
      username: '3202383',
      password: '3202383',
      userid: 3202383
    });

    testToken = await jwt.sign({
      userid: 3202383,
      username: '3202383'
    }, jwtSecret.secret);

    const testForm = await Form.create({
      formid: 3202383,
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
        userid: 3202383
      }
    });

    Form.destroy({
      where: {
        formid: 3202383
      }
    });

    Comment.destroy({
      where: {
        commentid: 3202383
      }
    });

    done();
  });

  it('GET COMMENT 200', done => {
    chai.request('http://localhost:3000')
      .get('/form/3202383/comment')
      .set({ 'Authorization': `Bearer ${testToken}` })
      .type('form')
      .set('content-type', 'application/json')
      .end((error, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

'use strict';

const Router = require('koa-router');
const router = new Router();
const Form = require('../db/models/form');
const User = require('../db/models/user');
const Comment = require('../db/models/comment');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const jwtSecret = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

// создает форму
router.post('/api/form', 
async ctx => {
  const body = {...ctx.request.body};
  const formBody = {...ctx.request.body};
  delete formBody['professions'];
  delete formBody['languageSkills'];
  delete formBody['messengers'];
    await Promise.all([
      Form.create(formBody),
      Profession.bulkCreate(body['professions']),
      LanguageSkill.bulkCreate(body['languageSkills']),
      Messenger.bulkCreate(body['messengers'])
    ])
      .then(([form, professions, languageSkills, messengers]) => {
        form.addProfessions(professions);
        form.addMessengers(messengers);
        form.addLanguageSkills(languageSkills);
        return [form, professions, languageSkills, messengers];
      })
      .then(data => {
        ctx.body = data;
      })
      .catch(err => {
        ctx.body = 'error: ' + err
      })
});

// получает все формы 
router.get('/api/forms', 
passport.authenticate('jwt', {session:false}), 
async ctx => {
  await Form.findAll({
    include: [
      {
        model: Profession,
        through: {
          attributes: []
        }
      },
      {
        model: Messenger,
        through: {
          attributes: []
        }
      },
      {
        model: LanguageSkill,
        through: {
          attributes: []
        }
      },
    ]
  })
    .then(forms => {
      ctx.body = forms
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

// получает форму по индексу 
router.get('/api/form/:formid', 
passport.authenticate('jwt', {session:false}), 
async ctx => {
  await Form.findOne({
    where: {
      formid: ctx.params.formid
    },
    include: [
      {
        model: Profession,
        through: {
          attributes: []
        }
      },
      {
        model: Messenger,
        through: {
          attributes: []
        }
      },
      {
        model: LanguageSkill,
        through: {
          attributes: []
        }
      },
    ]
  })
    .then(forms => {
      ctx.body = forms
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

// фильтрует формы
router.post('/api/form/filter', passport.authenticate('jwt', {session:false}), 
async ctx => {
  const body = ctx.request.body;
  await Form.findAll({
    where: {
      sex: body.sex,
      height: {
        [Op.gte]: body.height[0].from,
        [Op.lte]: body.height[0].to
      },
      born: {
        [Op.gte]: new Date(new Date() - body.age[0].to*(24 * 3600 * 365.25 * 1000)),
        [Op.lte]: new Date(new Date() - body.age[0].from*(24 * 3600 * 365.25 * 1000))
      },
      workExperience: {
        [Op.gte]: body.workExperience[0].from,
        [Op.lte]: body.workExperience[0].to
      },
      expectedSalary: {
        [Op.gte]: body.expectedSalary[0].from,
        [Op.lte]: body.expectedSalary[0].to
      },
      education: body.education      
    },
    include: [
      {
        model: Profession,
        where: {
          profession: body.professions.map(element => {
            return element.profession
          })
        },
        through: {
          attributes: []
        }
      },
      {
        model: Messenger,
        where: {
          messenger: body.messengers.map(element => {
            return element.messenger
          })
        },
        through: {
          attributes: []
        }
      },
      {
        model: LanguageSkill,
        where: {
          language: body.languageSkills[0].language,
          languageProficiency: body.languageSkills[0].languageProficiency=='any'?['native', 'fluent', 'intermediate', 'basic']:body.languageSkills[0].languageProficiency     
        },
        through: {
          attributes: []
        }
      },
    ]
  })
  .then(async forms => {
    await   await Form.findAll({
      where: {
        formid: forms.map(form => {
                return form.formid
              })
      },
      include: [
        {
          model: Profession,
          through: {
            attributes: []
          }
        },
        {
          model: Messenger,
          through: {
            attributes: []
          }
        },
        {
          model: LanguageSkill,
          through: {
            attributes: []
          }
        },
      ]
    })
      .then(forms => {
        ctx.body = forms
      })
      .catch(err => {
        ctx.body = 'error: ' + err
      })
  })
});

// удаляет форму
router.delete('/api/form/:formid', passport.authenticate('jwt', {session:false}), 
async ctx => {
  await Form.destroy({
    where: {
        formid: ctx.params.formid
    }
  })
    .then(() => {
      ctx.body = { status: 'Form Deleted!' }
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

// обновляет форму
router.put('/api/form/:formid', passport.authenticate('jwt', {session:false}), 
async ctx => {
  const formBody = {...ctx.request.body};
    await Promise.all([
      Form.update( formBody, 
        { where: { formid: ctx.params.formid } })
    ])
    .then(() => {
      ctx.body = { status: 'Form Updated!' }
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

router.post('/api/form/:formid/comment', passport.authenticate('jwt', {session:false}), 
async ctx => {
  const body = {...ctx.request.body};
    await Promise.all([
      Comment.create({
        formid: ctx.params.formid,
        comment: body.comment,
        userid: body.userid
      })
    ])
    .then((comment) => {
      ctx.body = { status: 'Comment created!',
                   comment: comment }
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

router.get('/api/form/:formid/comment', passport.authenticate('jwt', {session:false}), 
async ctx => {
    await Promise.all([
      Comment.findAll({
        where: {
          formid: ctx.params.formid
        }
      })
    ])
    .then((comments) => {
      ctx.body = comments
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

router.post('/api/register', async ctx => {
  const body = ctx.request.body;
    await Promise.all([
      User.create(body)
    ])
    .then(() => {
      ctx.body = { status: 'User created!' }
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

router.post('/api/login', async(ctx) => {
  await passport.authenticate('local', function (err, user, info) {
    if (user == false) {
      ctx.body = info.message;
    } else {
      ctx.login(user);
      const payload = {
        userid: user.userid,
        username: user.username,
      };
      const token = jwt.sign(payload, jwtSecret.secret);
      
      ctx.body = {user: user.username, token: token};
    }
  })(ctx);  
});

router.get('/api/logout', async (ctx) => {
  try {
      ctx.logout();
      ctx.body = {status:'User logged out'};
  } catch (error) {
      ctx.status = 400;
  }
})

module.exports = router;
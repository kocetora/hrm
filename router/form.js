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

// создает форму
router.post('/api/form', async ctx => {
  const body = JSON.parse(ctx.request.body);
  const formBody = JSON.parse(ctx.request.body);
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
router.get('/api/forms', async ctx => {
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
  
// фильтрует формы
router.post('/api/form/filter', async ctx => {
  const body = JSON.parse(JSON.stringify(ctx.request.body));
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
router.delete('/api/form/:formid', async ctx => {
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
router.put('/api/form/:formid', async ctx => {
  const formBody = JSON.parse(JSON.stringify(ctx.request.body));
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

router.post('/api/comment/', async ctx => {
  // const body = JSON.parse(JSON.stringify(ctx.request.body));
  const body = JSON.parse(ctx.request.body);
    await Promise.all([
      Comment.create(body)
    ])
    .then((comment) => {
      ctx.body = { status: 'Comment created!',
                   comment: comment }
    })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

router.get('/api/comment/:formid', async ctx => {
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

router.post('/api/user/', async ctx => {
  // const body = JSON.parse(JSON.stringify(ctx.request.body));
  const body = JSON.parse(ctx.request.body);
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

router.post('/api/users/', async ctx => {
  // const body = JSON.parse(JSON.stringify(ctx.request.body));
  const body = JSON.parse(ctx.request.body);
  console.log(body)
    await Promise.all([
      User.findOne({
        where:{
          login: body.login
        }
      })
    ])
    .then(function (user) {
        console.log(user[0])
        if (!user[0]) {
            console.log('skcn')
        } else if (!user[0].validPassword(body.password)) {
            console.log('cdns')
        } else {
            ctx.body = user;
        }
  })
    .catch(err => {
      ctx.body = 'error: ' + err
    })
});

module.exports = router;
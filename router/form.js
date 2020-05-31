'use strict';
const Router = require('koa-router');
const router = new Router();
const Form = require('../db/models/form');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');

// ищет нужные формы

// создает форму
router.post('/api/form', async ctx => {
  const body = JSON.parse(JSON.stringify(ctx.request.body));
  const formBody = JSON.parse(JSON.stringify(ctx.request.body));
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

// получает форму по идетентефикаору
router.get('/api/form/:formid', async ctx => {
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
    .then(form => {
      if (form) {
        ctx.body = form
      } else {
        ctx.body = 'Form does not exist'
      }
    })
    .catch(err => {
      ctx.body = 'error: ' + err
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

// требует доработки
// обновляет форму
router.put('/api/form/:formid', async ctx => {
  // const body = JSON.parse(ctx.request.body);
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

module.exports = router;
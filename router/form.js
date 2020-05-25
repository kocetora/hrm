'use strict';
const Router = require('koa-router');
const router = new Router();
const Form = require('../db/models/form');
const Profession = require('../db/models/profession');
const Messenger = require('../db/models/messenger');
const LanguageSkill = require('../db/models/languageSkill');

// требует доработки
// создает форму
router.post('/api/form', async ctx => {
    console.log(ctx.request.body);
    await Form.create(ctx.request.body)
      .then(data => {
        ctx.body = data

        async ctx => {
          console.log(ctx.request.body);
          await Profession.create(ctx.request.body)
            .then(data => {
              ctx.body = data
            })
            .catch(err => {
              ctx.body = 'error: ' + err
            })
      }

      })
      .catch(err => {
        ctx.body = 'error: ' + err
      })
});

// требует доработки
// обновляет форму
router.put('/api/form/:formid', async ctx => {
    //
  if (!ctx.request.body.firstname) {
    ctx.body = {
      error: 'Bad Data'
    }
  } else {
    await Form.update(
        //
      { firstname: ctx.request.body.firstname },
      { where: { formid: ctx.params.formid } }
    )
      .then(() => {
        ctx.body = { status: 'Form Updated!' }
      })
      .catch(err => {
        ctx.body = 'error: ' + err
      })
  }
});

// ищет нужные формы

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
        model: Messenger,
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

module.exports = router;
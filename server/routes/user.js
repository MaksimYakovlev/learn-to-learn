import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import mailer from '../middleware/nodemailer.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.end();
});

router
  .route('/signup')
  .get((req, res) => {
    res.end();
  })
  .post(async (req, res) => {
    const {
      name,
      lastname,
      email,
    } = req.body;
    // Проверка уникальности name и email вручную
    try {
      // const errUnqUser = await User.isUserUnique(name);
      const errUnqEmail = await User.isEmailUnique(email);
      if (errUnqEmail) {
        return res.status(401).json({ message: errUnqEmail });
      }

      function generatePassword() {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pass = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
          pass += charset.charAt(Math.floor(Math.random() * n));
        }
        return pass;
      }

      const password = generatePassword();

      const message = {
        from: 'Mailer Test <learntolearn@mail.ru>',
        to: email,
        subject: 'Регистрации нового пользовател',
        text: `
        Здравствуйте,

        Вы получили это сообщение, так как ваш адрес был использован при регистрации нового пользователя на сервере www.learntolearn.ru.
        Скачать приложение вы можете по этой ссылке:
        http://www.learntolearn.ru/learn2learn.apk - Android
        http://www.learntolearn.ru/learn2learn.ipa - Iphone

        Данные вашей учетной записи:
          
              Name:   ${name}
              Lastname:   ${lastname}
              Email:   ${email}
              Password:   ${password}
          


              Сообщение сгенерировано автоматически.`,
      };
      mailer(message);
      res.status(200);

      const hashedPassword = await bcrypt.hash(password, Number(process.env.ROUNDS) || 10);
      try {
        await new User({
          name,
          lastname,
          email,
          password: hashedPassword,
        }).save();
        return res.status(200).end();
      } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: error.message });
    }
  });

router
  .route('/login')
  .get((req, res) => {
    if (req.session.user) res.end();
    res.end();
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).populate('company');
      console.log(user);
      if (user && (await bcrypt.compare(password, user.password))) {
        req.session.user = user;
        req.session.user.password = undefined;
        req.session.user.company = user.company;
        res.status(200).json(user);
      } else if (!user) {
        res.status(401).json({ message: 'Введенный e-mail не зарегистрирован' });
      } else {
        res.status(401).json({ message: 'Введенный пароль не совпадает' });
      }
    } catch (error) {
      console.log(error.message);
      res.status(401).json({ message: error.message });
    }
  });

router.get('/logout', async (req, res) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
    } catch (error) {
      console.log(error.message);
      res.status(401).json({ message: error.message });
    }
    res.clearCookie('user_sid');
  }
  res.end();
});

router.get('/checkSession', (req, res) => {
  if (req.session.user) {
    return res.json({
      user: {
        _id: req.session.user._id,
        username: req.session.user.name,
      },
    });
  }
  res.status(401).end();
});

export default router;

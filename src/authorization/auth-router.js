const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { email, password } = req.body;
    const loginEmail = { email, password };

    for (const [key, value] of Object.entries(loginEmail)) {
      if (value === null) {
        return res.status(400).json({ error: `Missing '${key}' in request body.`});
      }
    }

    AuthService.getUserWithEmail(req.app.get('db'), loginEmail.email)
      .then(dbUser => {
        if (!dbUser) {
          return res.status(400).json({ error: 'User does not exist!' });
        }

        return AuthService.comparePasswords(loginEmail.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch) {
              return res.status(400).json({ error: 'Incorrect email or password. '});
            }

            const sub = dbUser.email;
            const payload = { restaurant_id: dbUser.id };
            res.send({ authToken: AuthService.createJwt(sub, payload) });
          });
      })
      .catch(next);
  });

module.exports = authRouter;
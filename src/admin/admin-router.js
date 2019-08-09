const express = require('express');
const AdminService = require('./admin-service');

const adminRouter = express.Router();
const jsonBodyParser = express.json();

adminRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { email, password } = req.body;
    const loginEmail = { email, password };

    for (const [key, value] of Object.entries(loginEmail)) {
      if (value === null) {
        return res.status(400).json({ error: `Missing '${key}' in request body.`});
      }
    }

    AdminService.getAdmin(req.app.get('db'), loginEmail.email)
      .then(adminUser => {
        if (!adminUser) {
          return res.status(400).json({ error: 'User does not exist! '});
        }

        return AdminService.comparePasswords(loginEmail.password, adminUser.password)
          .then(compareMatch => {
            if (!compareMatch) {
              return res.status(400).json({ error: 'Incorrect email or password. '});
            }

            const sub = adminUser.email;
            const payload = { admin_id: adminUser.id };
            res.send({ authToken: AdminService.createJwt(sub, payload) });
          });
      })
      .catch(next);
  });

module.exports = adminRouter;
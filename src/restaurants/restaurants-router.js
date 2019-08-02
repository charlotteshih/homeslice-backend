const express = require('express');
const path = require('path');
const RestaurantsService = require('./restaurants-service');

const restaurantsRouter = express.Router();
const jsonBodyParser = express.json();

restaurantsRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { name, email, password, phone, street_address, city, state, zipcode } = req.body;

  for (const field of ['name', 'email', 'password', 'phone', 'street_address', 'city', 'state', 'zipcode']) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing ${field}in request body`
      });
    }
  }

  const passwordError = RestaurantsService.validatePassword(password);

  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  RestaurantsService.hasUserWithUserName(req.app.get('db'), email)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName) {
        return res.status(400).json({ error: `Username already taken.` });
      }

      return RestaurantsService.hashPassword(password)
        .then(hashedPassword => {
          const newUser = {
            name: name.trim(),
            email,
            password: hashedPassword,
            phone,
            street_address,
            city,
            state,
            zipcode
          };

          // const restaurantString = RestaurantsService.urlifyName(restaurant.name)

          return RestaurantsService.insertUser(req.app.get('db'), newUser)
            .then(restaurant => {
              res.status(201).location(path.posix.join(req.originalUrl), `/${encodeURI(restaurant.name)}`)
            })
        })
    })
    .catch(next)
})

module.exports = restaurantsRouter;
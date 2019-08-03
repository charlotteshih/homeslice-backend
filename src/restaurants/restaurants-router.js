const express = require('express');
const path = require('path');
const RestaurantsService = require('./restaurants-service');

const restaurantsRouter = express.Router();
const jsonBodyParser = express.json();

restaurantsRouter.route('/')
  .get((req, res, next) => {
    RestaurantsService.getAllRestaurants(req.app.get('db'))
      .then(restaurants => {
        res.json(RestaurantsService.serializeUsers(restaurants));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name, email, password, phone, street_address, city, state, zipcode } = req.body;

    for (const field of ['name', 'email', 'password', 'phone', 'street_address', 'city', 'state', 'zipcode']) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field} in request body`
        });
      }
    }

    const passwordError = RestaurantsService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    RestaurantsService.hasUserWithUserName(req.app.get('db'), email)
      .then(hasUserWithEmail => {
        if (hasUserWithEmail) {
          return res.status(400).json({ error: `email already taken.` });
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

            return RestaurantsService.insertUser(req.app.get('db'), newUser)
              .then(restaurant => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl), `/${restaurant.id}`)
                  .json(RestaurantsService.serializeUser(restaurant));
              })
          })
      })
      .catch(next)
  })

restaurantsRouter.route('/:restaurant_id')
  .all(checkRestaurantExists)
  .get((req, res) => {
    return res.json(RestaurantsService.serializeUser(res.restaurant));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const db = req.app.get('db');
    const restaurant_id = req.params.restaurant_id;
    const restaurant = req.body;
    const restaurantToUpdate = restaurant;
    const numberOfValues = Object.values(restaurantToUpdate).filter(Boolean).length;

    if(numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body is empty.'
        }
      });
    }

    RestaurantsService.updateUser(db, restaurant_id, restaurantToUpdate)
      .then(numRowsAffected => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    RestaurantsService.removeUser(
      req.app.get('db'),
      req.params.restaurant_id
    )
      .then(numRowsAffected => res.status(204).end())
      .catch(next);
  })

async function checkRestaurantExists(req, res, next) {
  try {
    const restaurant = await RestaurantsService.getRestaurantById(
      req.app.get('db'),
      req.params.restaurant_id
    );

    if(!restaurant) {
      return res.status(404).json({
        error: 'Restaurant doesn\'t exist.'
      });
    }

    res.restaurant = restaurant;
    next();
  } catch(error) {
    next(error);
  }
}

module.exports = restaurantsRouter;
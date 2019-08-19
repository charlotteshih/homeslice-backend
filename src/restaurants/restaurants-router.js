const express = require("express");
const path = require("path");
const RestaurantsService = require("./restaurants-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { hasEmailInDb } = require("../middleware/registration");

const restaurantsRouter = express.Router();
const jsonBodyParser = express.json();

restaurantsRouter
  .route("/")
  .get((req, res, next) => {
    RestaurantsService.getAllRestaurants(req.app.get("db"))
      .then(restaurants => {
        res
          .status(200)
          .json(RestaurantsService.serializeMultipleRestaurants(restaurants));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {
      name,
      email,
      password,
      phone,
      street_address,
      city,
      state,
      zipcode
    } = req.body;

    for (let [key, value] of Object.entries(req.body)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body.` }
        });
      }
    }

    const passwordError = RestaurantsService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    hasEmailInDb(req.app.get("db"), email)
      .then(hasEmail => {
        if (hasEmail) {
          return res
            .status(400)
            .json({ error: { message: `Email is already in use.` } });
        }

        return RestaurantsService.hashPassword(password).then(
          hashedPassword => {
            const newRestaurant = {
              name: name.trim(),
              email: email.trim(),
              password: hashedPassword,
              phone: phone.trim(),
              street_address: street_address.trim(),
              city: city.trim(),
              state: state.trim(),
              zipcode: zipcode.trim()
            };

            return RestaurantsService.insertRestaurant(
              req.app.get("db"),
              newRestaurant
            ).then(restaurant => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl), `/${restaurant.id}`)
                .json(RestaurantsService.serializeRestaurant(restaurant));
            });
          }
        );
      })
      .catch(next);
  });

restaurantsRouter
  .route("/:restaurant_id")
  .all(_getRestaurantById)
  .get((req, res) => {
    return res
      .status(200)
      .json(RestaurantsService.serializeRestaurant(res.restaurant));
  })

  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const newFields = {};
    for (let field in req.body) {
      newFields[field] = req.body[field];
    }

    if (newFields == null) {
      return res.status(400).json({
        error: { message: `Request body must contain fields to update.` }
      });
    }

    RestaurantsService.updateRestaurant(db, restaurant_id, restaurantToUpdate)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    RestaurantsService.removeRestaurant(
      req.app.get("db"),
      req.params.restaurant_id
    )
      .then(() => res.status(204).end())
      .catch(next);
  });
// returns all orders and customers for a given restaurant ID
restaurantsRouter
  .route("/:restaurant_id/orders")
  .all(_getRestaurantById)
  .get((req, res) => {
    Promise.all([
      RestaurantsService.getOrdersForRestaurant(
        req.app.get("db"),
        req.params.restaurant_id
      ),
      RestaurantsService.getCustomersForRestaurant(
        req.app.get("db"),
        req.params.restaurant_id
      )
    ]).then(([ordersForRestaurant, customersForRestaurant]) => {
      res.status(200).json({
        orders: ordersForRestaurant,
        customers: customersForRestaurant
      });
    });
  });

async function _getRestaurantById(req, res, next) {
  try {
    const restaurant = await RestaurantsService.getRestaurantById(
      req.app.get("db"),
      req.params.restaurant_id
    );

    if (!restaurant) {
      return res.status(404).json({
        error: "Restaurant doesn't exist."
      });
    }

    res.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = restaurantsRouter;

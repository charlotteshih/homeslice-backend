const bcrypt = require("bcryptjs");
const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const RestaurantsService = {
  getAllRestaurants(db) {
    return db
      .from("restaurants")
      .select("*")
    // .select(
    //   "id",
    //   "name",
    //   "email",
    //   "phone",
    //   "street_address",
    //   "city",
    //   "state",
    //   "zipcode"
    // );
  },

  getRestaurantById(db, id) {
    return db
      .from("restaurants")
      .select("*")
      // .select(
      //   "id",
      //   "name",
      //   "email",
      //   "phone",
      //   "street_address",
      //   "city",
      //   "state",
      //   "zipcode"
      // )
      .where({ id })
      .first();
  },

  insertRestaurant(db, newRestaurant) {
    return db
      .insert(newRestaurant)
      .into("restaurants")
      .returning("*")
      .then(restaurantArr => restaurantArr[0]);
  },

  updateRestaurant(db, id, newRestaurantFields) {
    return db
      .from("restaurants")
      .where({ id })
      .update(newRestaurantFields)
      .returning("*")
      .then(restaurantArr => restaurantArr[0]);
  },

  removeRestaurant(db, id) {
    return db
      .from("restaurants")
      .where({ id })
      .delete();
  },

  getOrdersForRestaurant(db, requested_restaurant_id) {
    return db("orders")
      .where({ restaurant_id: requested_restaurant_id })
      .join("pizzas", { "orders.pizza_id": "pizzas.id" })
      .select(
        "orders.id",
        "orders.date_created",
        "orders.customer_id",
        "pizzas.size AS pizza_size",
        "pizzas.type AS pizza_type",
        "orders.order_status",
        "orders.order_total"
      );
  },

  getCustomersForRestaurant(db, requested_restaurant_id) {
    return db("customers")
      .join("orders", {
        "customers.id": "orders.customer_id"
      })
      .join("restaurants", { "orders.restaurant_id": "restaurants.id" })
      .where({ restaurant_id: requested_restaurant_id })
      .select(
        "customers.id",
        "customers.first_name",
        "customers.last_name",
        "customers.email",
        "customers.phone",
        "customers.street_address",
        "customers.city",
        "customers.state",
        "customers.zipcode"
      );
  },

  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters.";
    }
    if (password.length > 72) {
      return "Password must be shorter than 72 characters.";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces.";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain one uppercase, lowercase, number, and special character.";
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeMultipleRestaurants(restaurants) {
    return restaurants.map(this.serializeRestaurant);
  },

  serializeRestaurant(restaurant) {
    return {
      id: restaurant.id,
      name: xss(restaurant.name),
      email: xss(restaurant.email),
      password: restaurant.password,
      phone: xss(restaurant.phone),
      street_address: xss(restaurant.street_address),
      city: xss(restaurant.city),
      state: xss(restaurant.state),
      zipcode: xss(restaurant.zipcode)
    };
  }
};

module.exports = RestaurantsService;

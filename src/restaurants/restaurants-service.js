const bcrypt = require("bcryptjs");
const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const RestaurantsService = {
  getAllRestaurants(db) {
    return db.from("restaurants").select("*");
  },

  getRestaurantById(db, id) {
    return db
      .from("restaurants")
      .select("*")
      .where("restaurants.id", id)
      .first();
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("restaurants")
      .returning("*")
      .then(([user]) => user);
  },

  updateUser(db, id, newUserFields) {
    return db
      .from("restaurants")
      .where({ id })
      .update(newUserFields);
  },

  removeUser(db, id) {
    return db
      .from("restaurants")
      .where({ id })
      .delete();
  },

  hasUserWithUserName(db, email) {
    return db("restaurants")
      .where({ email })
      .first()
      .then(user => !!user);
  },

  getOrdersForRestaurant(db, requested_restaurant_id) {
    return db("orders").where({ restaurant_id: requested_restaurant_id });
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

  serializeUsers(restaurants) {
    return restaurants.map(this.serializeUser);
  },

  serializeUser(restaurant) {
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

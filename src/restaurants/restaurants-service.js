const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const RestaurantsService = {
  hasUserWithUserName(db, email) {
    return db('restaurants')
      .where({ email })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('restaurants')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters.';
    }
    if (password.length > 72) {
      return 'Password must be shorter than 72 characters.';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces.';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one uppercase, lowercase, number, and special character.';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(restaurant) {
    return {
      id: restaurant.id,
      name: xss(restaurant.name),
      email: xss(email),
      phone: xss(restaurant.phone),
      street_address: xss(restaurant.street_address),
      city: xss(restaurant.city),
      state: xss(restaurant.state),
      zipcode: xss(restaurant.zipcode)
    };
  },
  // urlifyName(name) {
  //   name = name.toLowerCase().trim()
  //   name = 
  // }
}

module.exports = RestaurantsService;
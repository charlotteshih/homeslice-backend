const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeRestaurantsArray() {
  return [
    {
      id: 1,
      name: 'Mario\'s Pizza',
      email: 'mario@mariospizza.com',
      password: 'ItsAMe123!',
      street_address: '123 Mushroom Street',
      city: 'Mushroom Land',
      state: 'MA',
      zip: '02467'
    },
    {
      id: 2,
      name: 'Luigi\'s Pizza',
      email: 'luigi@luigispizza.com',
      password: 'ItsAMe456!',
      street_address: '456 Mansion Way',
      city: 'Mushroom Land',
      state: 'MA',
      zip: '02467'
    },
    {
      id: 3,
      name: 'Bowser\'s Pizzeria',
      email: 'bowser@bowserspizzeria.com',
      password: 'Rawr789!',
      street_address: 'BOWSER\'S CASTLE',
      city: 'Koopa Keep',
      state: 'CT',
      zip: '03551'
    }
  ];
}

function makePizzasArray() {
  return [
    {
      id: 1,
      size: 'Small',
      type: 'Cheese'
    },
    {
      id: 2,
      size: 'X-Large',
      type: 'Supreme'
    },
    {
      id: 3,
      size: 'Medium',
      type: 'BBQ Chicken'
    },
    {
      id: 4,
      size: 'Large',
      type: 'Hawaiian'
    },
    {
      id: 5,
      size: 'Large',
      type: 'Pepperoni'
    }
  ];
}

function makeCustomersArray() {
  return [
    {
      id: 1,
      first_name: 'Peach',
      last_name: 'Princess',
      street_address: 'Peach\'s Castle',
      city: 'Mushroom Land',
      state: 'MA',
      zipcode: '02467'
    },
    {
      id: 2,
      first_name: 'Daisy',
      last_name: 'Princess',
      street_address: 'Peach\'s Castle',
      city: 'Mushroom Land',
      state: 'MA',
      zipcode: '02467'
    }
  ];
}

function makeExpectedRestaurant(restaurants, restaurant) {
  // const restaurant = restaurants.find(restaurant => restaurant.id === restaurants.id)

  return {
    id: restaurant.id,
    name: restaurant.name,
    email: restaurant.email,
    password: restaurant.password,
    street_address: restaurant.street_address,
    city: restaurant.city,
    state: restaurant.state,
    zipcode: restaurant.zipcode
  };
}

// function makeExpectedCustomer() {}

function makeMaliciousRestaurant(restaurant) {
  const maliciousRestaurant = {
    id: 911,
    name: 'Uh-oh',
    email: 'Naughty naughty very naughty <script>alert("xss");</script>',
    password: 'Password123!',
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    city: 'City Name',
    state: 'State',
    zipcode: '00000'
  };
  const expectedRestaurant = {
    ...makeExpectedRestaurant([restaurant], maliciousRestaurant),
    email: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousRestaurant,
    expectedRestaurant
  };
}

function makeMaliciousCustomer(customer) {
  const maliciousCustomer = {
    id: 911,
    first_name: 'Uh-oh',
    last_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    city: 'City Name',
    state: 'State',
    zipcode: '00000'
  };
  const expectedCustomer = {
    ...makeMaliciousRestaurant([customer], maliciousCustomer),
    last_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousCustomer,
    expectedCustomer
  };
}

function makeOrdersArray(restaurants, pizzas, customers) {
  return [
    {
      id: 1,
      restaurant_id: restaurants[1].id,
      pizza_id: pizzas[0].id,
      customer_id: customers[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
      order_status: 'Ordered',
      order_total: 10.59
    },
    {
      id: 2,
      restaurant_id: restaurants[2].id,
      pizza_id: pizzas[1].id,
      customer_id: customers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      order_status: 'Done',
      order_total: 7.00
    },
    {
      id: 3,
      restaurant_id: restaurants[0].id,
      pizza_id: pizzas[2].id,
      customer_id: customers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      order_status: 'In Progress',
      order_total: 11.99
    },
    {
      id: 4,
      restaurant_id: restaurants[2].id,
      pizza_id: pizzas[3].id,
      customer_id: customers[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
      order_status: 'Done',
      order_total: 9.69
    },
    {
      id: 5,
      restaurant_id: restaurants[0].id,
      pizza_id: pizzas[4].id,
      customer_id: customers[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      order_status: 'Ready for Pickup',
      order_total: 12.25
    }
  ];
}

function makeFixtures() {
  const testRestaurants = makeRestaurantsArray();
  const testPizzas = makePizzasArray();
  const testCustomers = makeCustomersArray();
  const testOrders = makeOrdersArray(testRestaurants, testPizzas, testCustomers);
  return { testRestaurants, testPizzas, testCustomers, testOrders };
}

function cleanTables(db) {
  return db.transaction(trx => {
    trx.raw(
      `TRUNCATE
        restaurants,
        pizzas,
        customers,
        orders`
    )
      .then(() => {
        Promise.all([
          trx.raw(`ALTER SEQUENCE restaurants_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE pizzas_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE customers_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE orders_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('restaurants_id_seq', 0)`),
          trx.raw(`SELECT setval('pizzas_id_seq', 0)`),
          trx.raw(`SELECT setval('customers_id_seq', 0)`),
          trx.raw(`SELECT setval('orders_id_seq', 0)`),
        ]);
      });
  });
}

function seedRestaurants(db, restaurants) {
  const preppedRestaurants = restaurants.map(restaurant => ({
    ...restaurant,
    password: bcrypt.hashSync(restaurant.password, 1)
  }));
  return db.into('restaurants').insert(preppedRestaurants)
    .then(() => {
      db.raw(
        `SELECT setval('restaurants_id_seq', ?)`,
        [restaurants[restaurants.length - 1].id],
      )
    });
}

function seedPizzas(db, pizzas) {
  return db.into('pizzas').insert(pizzas)
    .then(() => {
      db.raw(
        `SELECT setval('pizzas_id_seq', ?)`,
        [pizzas[pizzas.length - 1].id],
      )
    });
}

function seedCustomers(db, customers) {
  return db.into('customers').insert(customers)
    .then(() => {
      db.raw(
        `SELECT setval('customers_id_seq', ?)`,
        [customers[customers.length - 1].id],
      )
    });
}

function seedOrders(db, orders) {
  return db.into('orders').insert(orders)
    .then(() => {
      db.raw(
        `SELECT setval('orders_id_seq', ?)`,
        [orders[orders.length - 1].id],
      )
    });
}

function seedMaliciousRestaurant(db, restaurant, maliciousRestaurant) {
  return seedRestaurants(db, [restaurant])
    .then(() => {
      db.insert([maliciousRestaurant]).into('restaurants');
    });
}

function seedMaliciousCustomer(db, customer, maliciousCustomer) {
  return seedCustomers(db, [customer])
    .then(() => {
      db.insert([maliciousCustomer]).into('customers');
    });
}

function makeAuthHeader(restaurant, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ email: restaurant.email }, secret, {
    subject: restaurant.email,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeRestaurantsArray,
  makePizzasArray,
  makeCustomersArray,
  makeOrdersArray,
  // makeExpectedRestaurant,
  // makeExpectedCustomer,
  makeMaliciousRestaurant,
  makeMaliciousCustomer,

  makeFixtures,
  cleanTables,
  seedMaliciousRestaurant,
  seedMaliciousCustomer,
  makeAuthHeader,
  seedRestaurants,
  seedPizzas,
  seedCustomers,
  seedOrders,
  // seedRestaurantsTables,
  // seedPizzasTables,
  // seedCustomersTables,
  // seedOrdersTables,
};
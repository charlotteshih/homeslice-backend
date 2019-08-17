const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeRestaurantsArray() {
  return [
    {
      id: 1,
      name: "Mario's Pizza",
      email: "mario@mariospizza.com",
      password: "ItsAMe123!",
      phone: "333-333-3333",
      street_address: "123 Mushroom Street",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      id: 2,
      name: "Luigi's Pizza",
      email: "luigi@luigispizza.com",
      password: "ItsAMe456!",
      phone: "444-444-4444",
      street_address: "456 Mansion Way",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      id: 3,
      name: "Bowser's Pizzeria",
      email: "bowser@bowserspizzeria.com",
      password: "Rawr789!",
      phone: "555-555-5555",
      street_address: "BOWSER'S CASTLE",
      city: "Koopa Keep",
      state: "CT",
      zipcode: "03551"
    }
  ];
}

function pizzasArrayForSeeding() {
  [
    {
      size: "Small",
      type: "Cheese"
    },
    {
      size: "X-Large",
      type: "Supreme"
    },
    {
      size: "Medium",
      type: "BBQ Chicken"
    },
    {
      size: "Large",
      type: "Hawaiian"
    },
    {
      size: "Large",
      type: "Pepperoni"
    }
  ];
}

function makePizzasArray() {
  return [
    {
      id: 1,
      size: "Small",
      type: "Cheese"
    },
    {
      id: 2,
      size: "X-Large",
      type: "Supreme"
    },
    {
      id: 3,
      size: "Medium",
      type: "BBQ Chicken"
    },
    {
      id: 4,
      size: "Large",
      type: "Hawaiian"
    },
    {
      id: 5,
      size: "Large",
      type: "Pepperoni"
    }
  ];
}

function makeCustomersArray() {
  return [
    {
      id: 1,
      first_name: "Peach",
      last_name: "Princess",
      email: "peach@princess.com",
      phone: "111-111-1111",
      street_address: "Peach's Castle",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467",
      notes: ""
    },
    {
      id: 2,
      first_name: "Daisy",
      last_name: "Princess",
      email: "daisy@princess.com",
      phone: "222-222-2222",
      street_address: "Peach's Castle",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467",
      notes: ""
    }
  ];
}

function makeOrdersArray(restaurants, pizzas, customers) {
  return [
    {
      id: 1,
      restaurant_id: 2,
      pizza_id: 1,
      customer_id: 2,
      date_created: "2029-01-22T16:28:32.615Z",
      order_status: "Ordered",
      order_total: 10.59
    },
    {
      id: 2,
      restaurant_id: 3,
      pizza_id: 2,
      customer_id: 1,
      date_created: "2029-01-22T16:28:32.615Z",
      order_status: "Done",
      order_total: 7.0
    },
    {
      id: 3,
      restaurant_id: 1,
      pizza_id: 3,
      customer_id: 1,
      date_created: "2029-01-22T16:28:32.615Z",
      order_status: "In Progress",
      order_total: 11.99
    },
    {
      id: 4,
      restaurant_id: 3,
      pizza_id: 4,
      customer_id: 2,
      date_created: "2029-01-22T16:28:32.615Z",
      order_status: "Done",
      order_total: 9.69
    },
    {
      id: 5,
      restaurant_id: 1,
      pizza_id: 5,
      customer_id: 1,
      date_created: "2029-01-22T16:28:32.615Z",
      order_status: "Ready for Pickup",
      order_total: 12.25
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
    phone: restaurant.phone,
    street_address: restaurant.street_address,
    city: restaurant.city,
    state: restaurant.state,
    zipcode: restaurant.zipcode
  };
}

function makeExpectedCustomer(customers, customer) {
  // const customer = customers.find(customer => customer.id === customers.id)

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    street_address: customer.street_address,
    city: customer.city,
    state: customer.state,
    zipcode: customer.zipcode
  };
}

function makeMaliciousRestaurant(restaurant) {
  const maliciousRestaurant = {
    id: 911,
    name: "Uh-oh",
    email: 'Naughty naughty very naughty <script>alert("xss");</script>',
    password: "Password123!",
    phone: "000-000-0000",
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    city: "City Name",
    state: "State",
    zipcode: "00000"
  };
  const expectedRestaurant = {
    ...makeExpectedRestaurant([restaurant], maliciousRestaurant),
    email:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousRestaurant,
    expectedRestaurant
  };
}

function makeMaliciousCustomer(customer) {
  const maliciousCustomer = {
    id: 911,
    first_name: "Uh-oh",
    last_name: "Spaghetti-Os",
    email: 'Naughty naughty very naughty <script>alert("xss");</script>',
    phone: "000-000-0000",
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    city: "City Name",
    state: "State",
    zipcode: "00000"
  };

  const expectedCustomer = {
    ...makeExpectedCustomer([customer], maliciousCustomer),
    email:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    street_address: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousCustomer,
    expectedCustomer
  };
}

function makeFixtures() {
  const testRestaurants = makeRestaurantsArray();
  const testPizzas = makePizzasArray();
  const testCustomers = makeCustomersArray();
  const testOrders = makeOrdersArray(
    testRestaurants,
    testPizzas,
    testCustomers
  );
  return { testRestaurants, testPizzas, testCustomers, testOrders };
}

// FELIX: I removed the trx stuff that cleared out the sequences, because it seemed to break this function.
function cleanTables(db) {
  return db.raw(
    `TRUNCATE
        orders,
        restaurants,
        pizzas,
        customers
        RESTART IDENTITY CASCADE;
      
      ALTER SEQUENCE orders_id_seq MINVALUE 0 START WITH 1;
      ALTER SEQUENCE restaurants_id_seq MINVALUE 0 START WITH 1;
      ALTER SEQUENCE pizzas_id_seq MINVALUE 0 START WITH 1;
      ALTER SEQUENCE customers_id_seq MINVALUE 0 START WITH 1;

      SELECT setval('orders_id_seq', 0);
      SELECT setval('restaurants_id_seq', 0);
      SELECT setval('pizzas_id_seq', 0);
      SELECT setval('customers_id_seq', 0)`
  );
}

function seedRestaurants(db, restaurants) {
  const preppedRestaurants = restaurants.map(restaurant => ({
    ...restaurant,
    password: bcrypt.hashSync(restaurant.password, 12)
  }));
  return db
    .into("restaurants")
    .insert(preppedRestaurants)
    .then(() => {
      db.raw(`SELECT setval('restaurants_id_seq', ?)`, [
        restaurants[restaurants.length - 1].id
      ]);
    });
}

function seedPizzas(db, pizzas) {
  return db
    .into("pizzas")
    .insert(pizzas)
    .then(() => {
      db.raw(`SELECT setval('pizzas_id_seq', ?)`, [
        pizzas[pizzas.length - 1].id
      ]);
    });
}

function seedCustomers(db, customers) {
  return db
    .into("customers")
    .insert(customers)
    .then(() => {
      db.raw(`SELECT setval('customers_id_seq', ?)`, [
        customers[customers.length - 1].id
      ]);
    });
}

function seedOrders(db, orders) {
  return db
    .into("orders")
    .insert(orders)
    .then(() => {
      db.raw(`SELECT setval('orders_id_seq', ?)`, [
        orders[orders.length - 1].id
      ]);
    });
}

function seedMaliciousRestaurant(db, restaurant, maliciousRestaurant) {
  return seedRestaurants(db, [restaurant]).then(() => {
    db.insert([maliciousRestaurant]).into("restaurants");
  });
}

function seedMaliciousCustomer(db, customer, maliciousCustomer) {
  return seedCustomers(db, [customer]).then(() => {
    db.insert([maliciousCustomer]).into("customers");
  });
}

function makeAuthHeader(restaurant, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ email: restaurant.email }, secret, {
    subject: restaurant.email,
    algorithm: "HS256"
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
  seedOrders
  // seedRestaurantsTables,
  // seedPizzasTables,
  // seedCustomersTables,
  // seedOrdersTables,
};

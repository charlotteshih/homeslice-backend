const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeRestaurantsArray() {
  return [
    {
      name: "Mario's Pizza",
      email: "1mario@mariospizza.com",
      password: "ItsAMe123!",
      phone: "333-333-3333",
      street_address: "123 Mushroom Street",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      name: "Luigi's Pizza",
      email: "1luigi@luigispizza.com",
      password: "ItsAMe456!",
      phone: "444-444-4444",
      street_address: "456 Mansion Way",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      name: "Bowser's Pizzeria",
      email: "1bowser2@bowserspizzeria.com",
      password: "Rawr789!",
      phone: "555-555-5555",
      street_address: "BOWSER'S CASTLE",
      city: "Koopa Keep",
      state: "CT",
      zipcode: "03551"
    },
    {
      name: "Bowser's Pizzeria",
      email: "1bowser3@bowserspizzeria.com",
      password: "Rawr789!",
      phone: "555-555-5555",
      street_address: "BOWSER'S CASTLE",
      city: "Koopa Keep",
      state: "CT",
      zipcode: "03551"
    }
  ];
}

function makePizzasArray() {
  return [
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

function makeCustomersArray() {
  return [
    {
      first_name: "Peach",
      last_name: "Princess",
      email: "peach@princess.com",
      phone: "111-111-1111",
      street_address: "Peach's Castle",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      first_name: "Daisy",
      last_name: "Princess",
      email: "daisy@princess.com",
      phone: "222-222-2222",
      street_address: "Peach's Castle",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      first_name: "Daisy",
      last_name: "Princess",
      email: "daisy2@princess.com",
      phone: "222-222-2222",
      street_address: "Peach's Castle",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      first_name: "Daisy",
      last_name: "Princess",
      email: "daisy3@princess.com",
      phone: "222-222-2222",
      street_address: "Peach's Castle",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    },
    {
      first_name: "Daisy",
      last_name: "Princess",
      email: "daisy4@princess.com",
      phone: "222-222-2222",
      street_address: "Peach's Castle",
      city: "Mushroom Land",
      state: "MA",
      zipcode: "02467"
    }
  ];
}

function makeOrdersArray() {
  return [
    {
      restaurant_id: 1,
      pizza_id: 1,
      customer_id: 1,
      date_created: "2029-01-23T04:28:32.615Z",
      order_status: "Ordered",
      order_total: "10.59"
    },
    {
      restaurant_id: 1,
      pizza_id: 1,
      customer_id: 1,
      date_created: "2029-01-23T04:28:32.615Z",
      order_status: "Completed",
      order_total: "7.00"
    },
    {
      restaurant_id: 1,
      pizza_id: 1,
      customer_id: 1,
      date_created: "2029-01-23T04:28:32.615Z",
      order_status: "In Progress",
      order_total: "11.99"
    },
    {
      restaurant_id: 1,
      pizza_id: 1,
      customer_id: 1,
      date_created: "2029-01-23T04:28:32.615Z",
      order_status: "Completed",
      order_total: "9.69"
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

function addId(array) {
  let newArray = [];
  for (let i = 0; i < array.length; i++) {
    newArray.push({ id: i + 1, ...array[i] });
  }
  return newArray;
}

function makeFixtures() {
  const testRestaurants = makeRestaurantsArray();
  const testPizzas = makePizzasArray();
  const testCustomers = makeCustomersArray();
  const testOrders = makeOrdersArray();
  return { testRestaurants, testPizzas, testCustomers, testOrders };
}

// FELIX: I removed the trx stuff that cleared out the sequences, because it seemed to break this function.
function cleanTables(db) {
  return db.raw(
    `BEGIN;
    
    TRUNCATE
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
      SELECT setval('customers_id_seq', 0);
      
      COMMIT;`
  );
}

function seedRestaurants(db, restaurants) {
  return db
    .into("restaurants")
    .insert(restaurants)
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
  addId,
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

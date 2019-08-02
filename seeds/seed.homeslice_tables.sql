BEGIN;

TRUNCATE
  restaurants,
  pizzas,
  customers,
  orders
  RESTART IDENTITY CASCADE;

INSERT INTO restaurants (name, email, password, phone, street_address, city, state, zipcode)
VALUES (
  'Luigi''s Pizzeria',
  'luigis@luigispizza.com',
  'Luigi123!',
  '555-555-5555',
  '123 Pizza Avenue',
  'Flavortown',
  'CA',
  '90004'
);

INSERT INTO pizzas (size, type)
VALUES (
  'X-Large',
  'Supreme'
);

INSERT INTO customers (first_name, last_name, email, phone, street_address, city, state, zipcode)
VALUES (
  'Mario',
  'Mario',
  'mario@mariobrosplumbing.net',
  '111-111-1111',
  '987 Plumber Blvd. Apt. 2',
  'Nintendoland',
  'CA',
  '99999'
);

INSERT INTO orders (restaurant_id, pizza_id, customer_id, order_status, order_total)
VALUES (
  1,
  1,
  1,
  'Ordered',
  10.50
);

COMMIT;
BEGIN;

TRUNCATE
  orders,
  restaurants,
  pizzas,
  customers
  RESTART IDENTITY CASCADE;

INSERT INTO restaurants (name, email, password, phone, street_address, city, state, zipcode)
VALUES
  ('Admin', 'admin@homeslice.com', 'Admin123!', '000-000-0000', '123 Pizza Way', 'Flavortown', 'CA', '90027'),
  ('Demo', 'demo@demo.com', 'Demo123!', '000-000-0000', '123 Pizza Way', 'Flavortown', 'CA', '90027'),
  ('Luigi''s Pizzeria', 'luigis@luigispizza.com', 'Luigi123!', '555-555-5555', '123 Pizza Avenue', 'Flavortown', 'CA', '90004');

INSERT INTO pizzas (size, type, price)
VALUES
  ('X-Large', 'Supreme', 20.30);

INSERT INTO customers (first_name, last_name, email, phone, street_address, city, state, zipcode, notes)
VALUES
  ('Mario', 'Mario', 'mario@mariobrosplumbing.net', '111-111-1111', '987 Plumber Blvd. Apt. 2', 'Nintendoland', 'CA', '99999', '');

INSERT INTO orders (restaurant_id, pizza_id, customer_id, order_status, order_total)
VALUES
  (1, 1, 1, 'Ordered', 10.50);

COMMIT;
BEGIN;

TRUNCATE
  orders,
  restaurants,
  pizzas,
  customers
  RESTART IDENTITY CASCADE;

INSERT INTO restaurants (name, email, password, phone, street_address, city, state, zipcode)
VALUES
  ('Demo', 'demo@demo.com', '$2y$12$WspO0e0AQLsW2mkN.ha/lep16QK15fjzhYJd.qFYjs3K9Utwnkm3a', '000-000-0000', '123 Pizza Way', 'Flavortown', 'CA', '90027'),
  ('Luigi''s Pizzeria', 'luigis@luigispizza.com', '$2y$12$04vyO/KPoAhA.3xr2RLhJO9.Eo/j2gmGg6teWkwx.iQ7rwit6UOIO', '555-555-5555', '123 Pizza Avenue', 'Flavortown', 'CA', '90004');

INSERT INTO pizzas (size, type)
VALUES
  ('X-Large', 'Supreme');

INSERT INTO customers (first_name, last_name, email, phone, street_address, city, state, zipcode, notes)
VALUES
  ('Mario', 'Mario', 'mario@mariobrosplumbing.net', '111-111-1111', '987 Plumber Blvd. Apt. 2', 'Nintendoland', 'CA', '99999', '');

INSERT INTO orders (restaurant_id, pizza_id, customer_id, order_status, order_total)
VALUES
  (1, 1, 1, 'Ordered', 10.50);

INSERT INTO admin (email, password)
VALUES
  ('Admin', '$2y$12$8Xwa31EFSk/cGJip1.rZD.1eYJrluEY.ndZOi1bE3NT6D7aoufU5a');

COMMIT;
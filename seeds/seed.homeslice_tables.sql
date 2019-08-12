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
  ('Mario''s Pizzeria', 'mario@mariospizza.com', '$2y$12$YDZyUJ2kVlfrXcN8zIfH5O5AVX./EZbdmsVSc2kK2vsNl4goVQRmC', '555-555-5555', '123 Pizza Avenue', 'Mushroom Kingdom', 'CA', '90027'),
  ('Luigi''s Pizzeria', 'luigi@luigispizza.com', '$2y$12$04vyO/KPoAhA.3xr2RLhJO9.Eo/j2gmGg6teWkwx.iQ7rwit6UOIO', '555-555-5555', '123 Pizza Avenue', 'Mushroom Kingdom', 'CA', '90004');

INSERT INTO pizzas (size, type)
VALUES
  ('X-Large', 'Supreme'),
  ('Large', 'BBQ Chicken'),
  ('Small', 'Pepperoni'),
  ('Medium', 'Hawaiian'),
  ('Large', 'Supreme'),
  ('Small', 'Cheese'),
  ('Medium', 'Veggie'),
  ('Medium', 'Pepperoni'),
  ('X-Large', 'Supreme');

INSERT INTO customers (first_name, last_name, email, phone, street_address, city, state, zipcode, notes)
VALUES
  ('Princess', 'Peach', 'peach@princess.gov', '111-111-1111', '1 Peach''s Castle Way', 'Mushroom Kingdom', 'CA', '99999', ''),
  ('Princess', 'Daisy', 'daisy@princess.gov', '222-222-2222', '1 Daisy''s Castle Way', 'Mushroom Kingdom', 'CA', '99999', ''),
  ('King', 'Bowser', 'bowser@koopa.gov', '666-666-6666', '1 Bowser''s Castle Way', 'Koopa Keep', 'NV', '00000', '');

INSERT INTO orders (restaurant_id, pizza_id, customer_id, order_status, order_total)
VALUES
  (1, 1, 1, 'Ordered', 15.00),
  (1, 2, 1, 'In Progress', 13.00),
  (1, 3, 2, 'Canceled: Out of stock', 11.00),
  (1, 4, 3, 'Canceled: Customer request', 12.00),
  (1, 5, 3, 'Ready For Pickup', 14.00),
  (1, 6, 2, 'Completed', 9.00),
  (1, 7, 1, 'In Progress', 11.00),
  (2, 4, 2, 'Completed', 12.00),
  (2, 5, 2, 'In Progress', 14.00),
  (3, 6, 1, 'Canceled: Out of stock', 9.00),
  (3, 7, 3, 'Canceled: Customer request', 11.00),
  (3, 8, 3, 'Ordered', 12.00),
  (1, 9, 3, 'Ready For Pickup', 12.00);

INSERT INTO admin (email, password)
VALUES
  ('Admin', '$2y$12$8Xwa31EFSk/cGJip1.rZD.1eYJrluEY.ndZOi1bE3NT6D7aoufU5a');

COMMIT;
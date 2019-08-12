CREATE TYPE pizza_size AS ENUM
(
  'Small',
  'Medium',
  'Large',
  'X-Large'
);

CREATE TYPE pizza_type AS ENUM
(
  'Cheese',
  'Pepperoni',
  'Supreme',
  'Veggie',
  'Hawaiian',
  'BBQ Chicken'
);

CREATE TYPE order_status AS ENUM
(
  'Ordered',
  'In Progress',
  'Ready For Pickup',
  'Completed',
  'Canceled: Out of stock',
  'Canceled: Customer request',
  'Canceled: Other'
);

CREATE TABLE restaurants
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode TEXT NOT NULL
);

CREATE TABLE pizzas
(
  id SERIAL PRIMARY KEY,
  size pizza_size NOT NULL,
  type pizza_type NOT NULL
);

CREATE TABLE customers
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE orders
(
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  pizza_id INTEGER REFERENCES pizzas(id) ON DELETE CASCADE NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  date_created TIMESTAMP DEFAULT NOW() NOT NULL,
  order_status order_status NOT NULL,
  order_total NUMERIC(4,2) NOT NULL
);
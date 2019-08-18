# HomeSlice API

API for HomeSlice

[HomeSlice Front-End Repository](https://github.com/charlotteshih/homeslice-frontend)

## Tech Stack

- [Node](https://github.com/nodejs/node)
- [Express](https://github.com/expressjs/express)
- [PostgreSQL](https://www.postgresql.org/)
- [Knex.js](https://knexjs.org/)

## API Tree

```
/api
├── /admin
│   └── DELETE
│       └── /restaurant/restaurant_id
│   └── POST
│       └── /login
|
├── /authorization
│   └── POST /login
|
├── /customers
│   └── GET
│       ├── /
│       └── /:customer_id
│   └── POST
│       └── /
│   └── PATCH
│       └── /:customer_id
│   └── DELETE
│       └── /:customer_id
|
├── /orders
│   └── GET
│       ├── /
│       └── /:order_id
│   └── POST
│       └── /
│   └── PATCH
│       └── /:order_id
│   └── DELETE
│       └── /:order_id
|
├── /pizzas
│   └── GET
│       ├── /
│       └── /:pizza_id
│   └── POST
│       └── /
│   └── PATCH
│       └── /:pizza_id
│   └── DELETE
│       └── /:pizza_id
|
├── /restaurants
│   └── GET
│       ├── /
│       ├── /:restaurant_id
│       └── /:restaurant_id/orders
│   └── POST
│       └── /
│   └── PATCH
│       └── /:restaurant_id
│   └── DELETE
│       └── /:restaurant_id
|
├── /stripe
│   └── POST
│       └── /charge
```
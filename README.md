# HomeSlice API

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/charlotteshih/homeslice-backend.git`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Create an `.env` for environmental variables that will be ignored by git and read by the express server

## Scripts

Migrate the database `npm run migrate`

Seed the database `psql -U homeslice -d homeslice -f ./seeds/seed.homeslice-tables.sql`

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

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
d
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
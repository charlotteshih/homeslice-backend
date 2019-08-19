require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const adminRouter = require('./admin/admin-router');
const authRouter = require('./authorization/auth-router');
const restaurantsRouter = require('./restaurants/restaurants-router');
const pizzasRouter = require('./pizzas/pizzas-router');
const customersRouter = require('./customers/customers-router');
const ordersRouter = require("./orders/orders-router");
const stripeRouter = require("./stripe/stripe-router");

const app = express();

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.options('*', cors());
app.use(helmet());

app.use('/api/admin', adminRouter);
app.use('/api/authorization', authRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/pizzas', pizzasRouter);
app.use('/api/customers', customersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/stripe", stripeRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(errorHandler);

function errorHandler(error, req, res, next) {
  let response;

  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  }

  console.error(error);
  response = { message: error.message, error };

  res.status(500).json(response);
}

module.exports = app;

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./authorization/auth-router');
const restaurantsRouter = require('./restaurants/restaurants-router');
const pizzasRouter = require('./pizzas/pizzas-router');
const customersRouter = require('./customers/customers-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(morgan(morganOption));
app.use(cors());
app.options('*', cors());
app.use(helmet());

app.use('/api/authorization', authRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/pizzas', pizzasRouter);
app.use('/api/customers', customersRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use(errorHandler);

function errorHandler(error, req, res, next) {
    let response

    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    }

    console.error(error);
    response = { message: error.message, error };

    res.status(500).json(response);
}

module.exports = app;
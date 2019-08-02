const express = require('express');
const path = require('path');
const CustomersService = require('./customers-service');

const customersRouter = express.Router();
const jsonBodyParser = express.json();

customersRouter.route('/')
  .get((req, res, next) => {
    CustomersService.getAllCustomers(req.app.get('db'))
      .then(customers => {
        res.json(CustomersService.serializeCustomers(customers));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    for (const [key, value] of Object.entries(req.body)) {
      if (value === null) {
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body.`
          }
        })
      }
    }
    CustomersService.insertCustomer(
      req.app.get('db'),
      req.body
    )
      .then(customer => {
        res.status(201).location(path.posix.join(req.originalUrl, `/${customer.id}`)).json(CustomersService.serializeCustomer(customer))
      })
      .catch(next);
  })

customersRouter.route('/:customer_id')
  .all(checkCustomerExists)
  .get((req, res) => {
    return res.json(CustomersService.serializeCustomer(res.customer));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const db = req.app.get('db');
    const customer_id = req.params.customer_id;
    const customer = req.body;
    const customerToUpdate = customer;
    const numberOfValues = Object.values(customerToUpdate).filter(Boolean).length;

    if(numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body is empty.'
        }
      });
    }
    CustomersService.updateCustomer(db, customer_id, customerToUpdate)
      .then(numRowsAffected => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    CustomersService.removeCustomer(
      req.app.get('db'),
      req.params.customer_id
    )
      .then(numRowsAffected => res.status(204).end())
      .catch(next);
  })

async function checkCustomerExists(req, res, next) {
  try {
    const customer = await CustomersService.getById(
      req.app.get('db'),
      req.params.customer_id
    );

    if(!customer) {
      return res.status(404).json({
        error: 'Customer doesn\'nt exist.'
      });
    }

    res.customer = customer;
    next();
  } catch(error) {
    next(error);
  }
}

module.exports = customersRouter;
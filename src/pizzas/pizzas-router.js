const express = require('express');
const path = require('path');
const PizzasService = require('./pizzas-service');
const jsonBodyParser = express.json();
const pizzasRouter = express.Router();

pizzasRouter
  .route('/')
  .get((req, res, next) => {
    PizzasService.getAllPizzas(req.app.get('db'))
      .then(allPizzas => {
        res.status(200).json(allPizzas);
      });
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { size , type } = req.body;
    //TODO add logic to calculate pizza price depending on size and type.
    const price = 5;
    const newPizza = {
      size,
      type,
      price,
    };
    PizzasService.createPizza(req.app.get('db'), newPizza)
      .then(returning => {
        res.status(201).json(returning);
      })
  });
  

pizzasRouter
  .route('/:pizza_id')
  .get((req, res, next) => {
    PizzasService.getPizzaById(req.app.get('db'), req.params.pizza_id)
      .then(pizza => {
        res.status(200).json(pizza);
      });
  })
  .patch(jsonBodyParser, (req, res, next) => {
    let dataToUpdate = req.body;
    PizzasService.updatePizza(req.app.get('db'), req.params.pizza_id, dataToUpdate)
      .then(numRowsAffected => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    PizzasService.deletePizzaById(req.app.get('db'), req.params.pizza_id)
      .then(deletedPizza => {
        res.status(204).end();
      });
  });
  

module.exports = pizzasRouter;
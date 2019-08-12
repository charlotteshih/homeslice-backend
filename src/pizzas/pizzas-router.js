const express = require("express");
const PizzasService = require("./pizzas-service");

const jsonBodyParser = express.json();
const pizzasRouter = express.Router();

pizzasRouter
  .route("/")
  .get((req, res, next) => {
    PizzasService.getAllPizzas(req.app.get("db")).then(allPizzas =>
      res.status(200).json(allPizzas)
    );
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { size, type } = req.body;
    //TODO add logic to calculate pizza price depending on size and type.
    // const price = 5;
    const newPizza = {
      size,
      type,
      // price
    };
    PizzasService.createPizza(req.app.get("db"), newPizza).then(newPizza =>
      res.status(201).json(newPizza)
    );
  });

pizzasRouter
  .all(_getPizzaById)
  .route("/:pizza_id")
  .get((req, res) => res.status(200).json(res.pizza))
  .patch(jsonBodyParser, (req, res, next) => {
    let dataToUpdate = req.body;

    if (!dataToUpdate) {
      return res.status(400).json({
        error: { message: `Request body must contain fields to update.` }
      });
    }

    PizzasService.updatePizza(
      req.app.get("db"),
      req.params.pizza_id,
      dataToUpdate
    )
      .then(() => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    PizzasService.deletePizzaById(req.app.get("db"), req.params.pizza_id).then(
      () => res.status(204).end()
    );
  });

async function _getPizzaById(req, res, next) {
  try {
    const pizza = await PizzasService.getPizzaById(
      req.app.get("db"),
      req.params.pizza_id
    );

    if (!pizza) {
      return res.status(404).json({ error: `Pizza doesn't exist.` });
    }
    res.pizza = pizza;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = pizzasRouter;

const express = require("express");
const OrdersService = require("./orders-service");
const PizzasService = require("../pizzas/pizzas-service");

const ordersRouter = express.Router();
const jsonBodyParser = express.json();

ordersRouter
  .route("/")
  .get((req, res, next) => {
    OrdersService.getAllOrders(req.app.get("db"))
      .then(orders => {
        res
          .status(200)
          .json(orders.map(order => OrdersService.serializeOrder(order)));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {
      restaurant_id,
      pizza_id,
      customer_id,
      date_created,
      order_status,
    } = req.body;

    PizzasService.getPizzaById(req.app.get('db'), pizza_id)
      .then(res => {
        // Takes pizza info from response body and calculates pricing information based on size and type
        let pizzaSize = res.size;
        let pizzaType = res.type;

        let basePrice = 0;
        let addlPrice = 0;

        switch (pizzaSize) {
          case "Small":
            basePrice = 9;
            break;
          case "Medium":
            basePrice = 10;
            break;
          case "Large":
            basePrice = 11;
            break;
          case "X-Large":
            basePrice = 12;
            break;
          default:
            basePrice = 0;
        }

        switch (pizzaType) {
          case "Cheese":
            addlPrice = 0;
            break;
          case "Pepperoni":
            addlPrice = 2;
            break;
          case "Supreme":
            addlPrice = 3;
            break;
          case "Veggie":
            addlPrice = 1;
            break;
          case "Hawaiian":
            addlPrice = 2;
            break;
          case "BBQ Chicken":
            addlPrice = 2;
            break;
          default:
            addlPrice = 0;
        }

        let order_total = basePrice + addlPrice;

        const newOrder = {
          restaurant_id,
          pizza_id,
          customer_id,
          date_created,
          order_status,
          order_total
        };

        for (const [key, value] of Object.entries(newOrder)) {
          if (value == null && value !== date_created) {
            return res.status(400).json({
              error: `Missing '${key}' in request body`
            });
          }
        }
        return OrdersService.insertOrder(req.app.get("db"), newOrder)
      })
      .then(order => res.status(201).json({ ...order }))
      .catch(next);
  });

ordersRouter
  .route("/:order_id")
  .all(_getOrderById)
  .get((req, res) => {
    return res.status(200).json(OrdersService.serializeOrder(res.order));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const newFields = {};
    for (let field in req.body) {
      newFields[field] = req.body[field];
    }

    if (newFields == null) {
      return res.status(400).json({
        error: { message: `Request body must contain fields to update.` }
      });
    }

    OrdersService.updateOrder(req.app.get("db"), req.params.order_id, newFields)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    OrdersService.deleteOrder(req.app.get("db"), req.params.order_id)
      .then(() => res.status(204).end())
      .catch(next);
  });

async function _getOrderById(req, res, next) {
  try {
    const order = await OrdersService.getOrderById(
      req.app.get("db"),
      req.params.order_id
    );

    if (!order) {
      return res.status(404).json({ error: `Order doesn't exist.` });
    }
    res.order = order;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = ordersRouter;

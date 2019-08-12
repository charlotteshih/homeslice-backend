const express = require("express");
const OrdersService = require("./orders-service");

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
      order_total
    } = req.body;

    const newOrder = {
      restaurant_id,
      pizza_id,
      customer_id,
      date_created,
      order_status,
      order_total
    };
    // checks that all keys are included in request body (except date_created, which should only be included if you want the date to be something other than now)
    for (const [key, value] of Object.entries(newOrder)) {
      if (value == null && value !== date_created) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    OrdersService.insertOrder(req.app.get("db"), newOrder)
      .then(order => {
        res.status(201).json({ ...order });
      })
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

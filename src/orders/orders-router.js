const express = require('express');
const path = require('path');
const OrdersService = require('./orders-service')

const ordersRouter = express.Router();
const jsonParser = express.json();

ordersRouter
.route('/')
.get((req, res, next) => {
    OrdersService.getAllOrders(req.app.get('db')).then(orders => {
        res.json(orders.map(OrdersService.serializeOrder(orders)))
    }).catch(next)
})

ordersRouter
.route('/:order_id')
.all(checkOrderExists)
.get((req, res) => {
    res.json(OrdersService.serializeOrder(res.order))
})

ordersRouter
.route('/')
.post(jsonParser, (req, res, next) => {
    const {restaurant_id, pizza_id, customer_id, date_created, order_status, order_total} = req.body

    const newOrder = {restaurant_id, pizza_id, customer_id, date_created, order_status, order_total}

    for (const [key, value] of Object.entries(newOrder)) {
        if (value == null && value !== date_created) {
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
        }
    }

    ordersService.insertOrder(req.app.get('db'), newOrder)
        .then(order => {
            res
                .status(201)
                .json({OrdersService.serializeOrder(order)})
        })
    .catch(next)
})

// ordersRouter
// .route('/:order_id')
// .all(checkOrderExists)
// .patch()

async function checkOrderExists(req, res, next) {
    try {
        const order = await OrdersService.getOrderById(req.app.get('db'), req.params.order_id)
    
    if (!order) {
        return res.status(404).json({error: `Order doesn't exist`})
    }
    res.order = order
    next()
    } catch (error) {
        next(error)
    }
        
}

module.exports = ordersRouter

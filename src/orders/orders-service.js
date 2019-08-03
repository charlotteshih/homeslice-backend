const xss = require("xss");

const OrdersService = {
  getAllOrders(db) {
    return db
      .from("orders")
      .select(
        "id",
        "restaurant_id",
        "pizza_id",
        "customer_id",
        "date_created",
        "order_status",
        "order_total"
      );
  },

  getOrderById(db, requestedId) {
    return OrdersService.getAllOrders(db)
      .where({ id: requestedId })
      .first();
  },
  // must supply every value of the new order except the id (which is the primary key, and will be generated upon insertion)
  insertOrder(db, order) {
    return db
      .insert({
        restaurant_id: order.restaurant_id,
        pizza_id: order.pizza_id,
        customer_id: order.customer_id,
        date_created: order.date_created,
        order_status: order.order_status,
        order_total: order.order_total
      })
      .into("orders")
      .returning("*")
      .then(([order]) => order);
  },
  // updates order_status and order_total only
  updateOrder(db, order) {
    return db
      .from("orders")
      .where({ id: order.id })
      .update({
        order_status: order.order_status,
        order_total: order.order_total
      })
      .returning("*")
      .then(([order]) => order);
  },

  deleteOrder(db, order) {
    return db
      .from("orders")
      .where({ id: order.id })
      .del();
  },

  serializeOrder(order) {
    return {
      id: order.id,
      restaurant_id: order.restaurant_id,
      pizza_id: order.pizza_id,
      customer_id: order.customer_id,
      date_created: order.date_created,
      order_status: order.order_status,
      order_total: order.order_total
    };
  }
};

module.exports = OrdersService;

/*

CREATE TYPE order_status AS ENUM (
  'Ordered',
  'In Progress',
  'Ready For Pickup',
  'Done'
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  pizza_id INTEGER REFERENCES pizzas(id) ON DELETE CASCADE NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  date_created TIMESTAMP DEFAULT now NOT NULL,
  order_status order_status
  order_total INTEGER NOT NULL
);

*/

const xss = require("xss");

const OrdersService = {
  getAllOrders(db) {
    return db
      .from("orders")
      .select("*");
  },

  getOrderById(db, id) {
    return db
      .from("orders")
      .where({ id })
      .first();
  },

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
      .then(orderArr => orderArr[0]);
  },

  updateOrder(db, id, newOrderFields) {
    return db
      .from("orders")
      .where({ id })
      .update({ ...newOrderFields })
      .returning("*")
      .then(orderArr => orderArr[0]);
  },

  deleteOrder(db, id) {
    return db
      .from("orders")
      .where({ id })
      .delete();
  },

  serializeOrder(order) {
    return {
      id: order.id,
      restaurant_id: order.restaurant_id,
      pizza_id: order.pizza_id,
      customer_id: order.customer_id,
      date_created: order.date_created,
      order_status: xss(order.order_status),
      order_total: order.order_total
    };
  }
};

module.exports = OrdersService;

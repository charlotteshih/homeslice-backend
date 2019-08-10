const PizzasService = {
  getAllPizzas(db) {
    return db("pizzas")
      .join("pizza_sizes", { "pizzas.pizza_size": "pizza_sizes.id" })
      .join("pizza_types", { "pizzas.pizza_type": "pizza_types.id" })
      .select(
        "pizzas.id",
        "pizza_sizes.size",
        "pizza_types.type",
        "pizza_sizes.base_price",
        "pizza_types.addl_price"
      );
  },
  getPizzaById(db, id) {
    return db("pizzas")
      .where({ id })
      .join("pizza_sizes", { "pizzas.pizza_size": "pizza_sizes.id" })
      .join("pizza_types", { "pizzas.pizza_type": "pizza_types.id" })
      .select(
        "pizzas.id",
        "pizza_sizes.size",
        "pizza_types.type",
        "pizza_sizes.base_price",
        "pizza_types.addl_price"
      );
  },
  createPizza(db, newPizza) {
    return db
      .into("pizzas")
      .insert(newPizza)
      .returning("*")
      .then(pizzaArr => pizzaArr[0]);
  },
  updatePizza(db, id, dataToUpdate) {
    return db
      .from("pizzas")
      .where({ id })
      .update(dataToUpdate)
      .returning("*")
      .then(pizzaArr => pizzaArr[0]);
  },
  deletePizzaById(db, id) {
    return db
      .from("pizzas")
      .where({ id })
      .delete();
  }
};

module.exports = PizzasService;

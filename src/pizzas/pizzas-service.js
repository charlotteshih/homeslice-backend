const PizzasService = {
  getAllPizzas(db) {
    return db("pizzas").select("*");
  },
  getPizzaById(db, id) {
    return db("pizzas")
      .where({ id })
      .select("*");
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

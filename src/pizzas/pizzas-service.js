const PizzasService = {
  getAllPizzas(db) {
    return db
      .from('pizzas')
      .select('*');
  },
  getPizzaById(db, id) {
    return db
      .from('pizzas')
      .select('*')
      .where({ id });
  },
  createPizza(db, newPizza) {
    return db
      .into('pizzas')
      .insert(newPizza)
      .returning('*');
  },
  updatePizza(db, id, dataToUpdate ) {
    return db
      .from('pizzas')
      .where({ id })
      .update(dataToUpdate)
      .returning('*');
  }, 
  deletePizzaById(db, id) {
    return db
      .from('pizzas')
      .where({ id })
      .delete();
  }
}

module.exports = PizzasService;
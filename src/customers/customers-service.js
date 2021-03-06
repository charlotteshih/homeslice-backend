const xss = require('xss');

const CustomersService = {
  getAllCustomers(db) {
    return db
      .from('customers')
      .select('*');
  },

  getById(db, id) {
    return db
      .from('customers')
      .select('*')
      .where({ id })
      .first();
  },

  insertCustomer(db, newCust) {
    return db
      .insert(newCust)
      .into('customers')
      .returning('*')
      .then(customerArr => customerArr[0])
      .then(customer => CustomersService.getById(db, customer.id));
  },

  updateCustomer(db, id, newCustomerFields) {
    return db
      .from('customers')
      .where({ id })
      .update(newCustomerFields);
  },

  removeCustomer(db, id) {
    return db
      .from('customers')
      .where({ id })
      .delete();
  },

  serializeMultipleCustomers(customers) {
    return customers.map(this.serializeCustomer);
  },

  serializeCustomer(customer) {
    return {
      id: customer.id,
      first_name: xss(customer.first_name),
      last_name: xss(customer.last_name),
      email: xss(customer.email),
      phone: xss(customer.phone),
      street_address: xss(customer.street_address),
      city: xss(customer.city),
      state: xss(customer.state),
      zipcode: xss(customer.zipcode),
      notes: xss(customer.notes)
    };
  }
};

module.exports = CustomersService;
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
      .where('customers.id', id)
      .first();
  },

  insertCustomer(db, newCust) {
    return db
      .insert(newCust)
      .into('customers')
      .returning('*')
      .then(([customer]) => customer)
      .then(customer =>
        CustomersService.getById(db, customer.id)
      );
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

  serializeCustomers(customers) {
    return customers.map(this.serializeCustomer);
  },

  serializeCustomer(customer) {
    return {
      id: customer.id,
      first_name: xss(customer.first_name),
      last_name: xss(customer.last_name),
      email: xss(customer.email),
      phone: xss(customer.phone),
      street_address: xss(street_address),
      city: xss(city),
      state: xss(state),
      zipcode: xss(zipcode)
    };
  }
};

module.exports = CustomersService;
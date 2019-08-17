const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe(`Customers Endpoints`, function () {
  let db;

  const { testCustomers } = helpers.makeFixtures();
  const seedCustomers = helpers.makeCustomersArray();

  before(`Make knex instance`, () => {
    db = knex({
      client: `pg`,
      connection: process.env.TEST_DB_URL
    });
    app.set(`db`, db);
  });

  after(`Disconnect from db`, () => db.destroy());
  before(`Cleanup`, () => helpers.cleanTables(db));
  afterEach(`Cleanup`, () => helpers.cleanTables);

  describe(`GET /api/customers`, () => {
    context(`Given there are customers in the database`, () => {
      beforeEach(`Insert customers`, () => {
        helpers.seedCustomers(db, seedCustomers);
      });

      it(`Responds with 200 and all of the customers`, () => {
        return supertest(app)
          .get(`/api/customers`)
          .expect(200, testCustomers);
      });
    });
  });

  describe(`GET /api/customers/:customer_id`, () => {
    context(`Given no customers`, () => {
      it(`Responds with 404`, () => {
        const customerId = 12345;
        return supertest(app)
          .get(`/api/customers${customerId}`)
          .expect(404, {});
      });
    });

    context(`Given there are customers in the database`, () => {
      beforeEach(`Insert customers`, () => {
        helpers.seedCustomers(db, seedCustomers);
      });

      it(`Responds with 200 and the specified customer`, () => {
        return supertest(app)
          .get(`/api/customers/1`)
          .expect(200, testCustomers[0])
      });
    });
  });

  describe(`POST /api/customers`, () => {
    context(`Given no customers`, () => {
      it(`Responds with 201 and a customer object`, () => {
        const customerInfo = {
          id: 12345,
          first_name: "Test",
          last_name: "Customer",
          email: "test@customer.com",
          phone: "000-000-0000",
          street_address: "123 Test Address Street",
          city: "Test City",
          state: "TEST",
          zipcode: "99999",
          notes: ""
        };

        return supertest(app)
          .post(`/api/customers`)
          .send(customerInfo)
          .expect(201, customerInfo);
      });
    });
  });

  describe(`PATCH /api/customers/:customer_id`, () => {
    context(`Given there are customers in the database`, () => {
      beforeEach(`Insert customers`, () => {
        helpers.seedCustomers(db, seedCustomers);
      });

      it(`Responds with 204`, () => {
        const customerInfo = {
          id: 1,
          first_name: "Test",
          last_name: "Customer",
          email: "test@customer.com",
          phone: "000-000-0000",
          street_address: "123 Test Address Street",
          city: "Test City",
          state: "TEST",
          zipcode: "99999"
        };

        return supertest(app)
          .patch(`/api/customers/1`)
          .send(customerInfo)
          .expect(204);
      });
    });
  });

  describe(`DELETE /api/customers/:customer_id`, () => {
    context(`Given there are customers in the database`, () => {
      beforeEach(`Insert customers`, () => {
        helpers.seedCustomers(db, seedCustomers);
      });

      it(`Responds with 204`, () => {
        return supertest(app)
          .delete(`/api/customers/1`)
          .expect(204);
      })
    })
  })
});
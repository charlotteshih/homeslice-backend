const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Orders Endpoints", function () {
  let db;

  const {
    testRestaurants,
    testPizzas,
    testCustomers,
    testOrders
  } = helpers.makeFixtures();

  console.log("testOrders", testOrders);

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/orders`, () => {
    context(`Given no orders`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/orders")
          .expect(200, []);
      });
    });

    context(`Given there are orders in the database`, () => {
      beforeEach("insert orders", () => {
        helpers
          .seedPizzas(db, testPizzas)
          .then(() => helpers.seedRestaurants(db, testRestaurants))
          .then(() => helpers.seedCustomers(db, testCustomers))
          .then(() => helpers.seedOrders(db, testOrders));
      });

      it("responds with 200 and all of the orders", () => {
        return supertest(app)
          .get("/api/orders")
          .expect(200);
      });
    });
  });

  describe(`GET /api/orders/:order_id`, () => {
    context(`Given no orders`, () => {
      it(`responds with 404`, () => {
        const orderId = 1;
        return supertest(app)
          .get(`/api/orders/${orderId}`)
          .expect(404, { error: `Order doesn't exist.` });
      });
    });

    context(`Given there are orders in the database`, () => {
      beforeEach("insert orders", () => {
        helpers
          .seedPizzas(db, testPizzas)
          .then(() => helpers.seedRestaurants(db, testRestaurants))
          .then(() => helpers.seedCustomers(db, testCustomers))
          .then(() => helpers.seedOrders(db, testOrders));
      });

      it("responds with 200 and the selected order", () => {
        const orderId = 1;
        return supertest(app)
          .get(`/api/orders/${orderId}`)
          .expect(404);
      });
    });
  });

  describe(`POST /api/orders`, () => {
    context(`Given there are orders in the database`, () => {
      beforeEach("insert orders", () => {
        helpers.seedPizzas(db, testPizzas);
        helpers.seedRestaurants(db, testRestaurants);
        helpers.seedCustomers(db, testCustomers);
        helpers.seedOrders(db, testOrders);
      });
      it(`responds with 201 and order object`, () => {
        const orderInfo = {
          restaurant_id: 1,
          pizza_id: 1,
          customer_id: 1,
          date_created: "2019-08-18T04:25:41.222Z",
          order_status: "Ordered"
        };
        return supertest(app)
          .post(`/api/orders/`)
          .send(orderInfo)
          .expect(201);
      });
    });
  });
});

const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Orders Endpoints", function() {
  let db;

  const testFixtures = helpers.makeFixtures();
  const testOrders = testFixtures.testOrders;
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

  //   afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/orders`, () => {
    // context(`Given no orders`, () => {
    //   it(`responds with 200 and an empty list`, () => {
    //     return supertest(app)
    //       .get("/api/orders")
    //       .expect(200, []);
    //   });
    // });

    context(`Given there are orders in the database`, () => {
      beforeEach("insert articles", () => {
        helpers.seedOrders(db, testOrders);
      });

      it("responds with 200 and all of the orders", () => {
        return supertest(app)
          .get("api/orders")
          .expect(200, testOrders);
      });
    });
  });
});

const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Pizzas Endpoints", function() {
  let db;

  const { testPizzas } = helpers.makeFixtures();
  console.log("testPizzas", testPizzas);

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

  describe(`GET /api/pizzas`, () => {
    context(`Given no pizzas`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/pizzas")
          .expect(200, []);
      });
    });

    context(`Given there are pizzas in the database`, () => {
      beforeEach("insert pizzas", () => {
        helpers.seedPizzas(db, testPizzas);
      });

      it("responds with 200 and all of the pizzas", () => {
        return supertest(app)
          .get("/api/pizzas")
          .expect(200, helpers.addId(testPizzas));
      });
    });
  });

  describe(`GET /api/pizzas/:pizza_id`, () => {
    context(`Given no pizzas`, () => {
      it(`responds with 404`, () => {
        const pizzaId = 1;
        return supertest(app)
          .get(`/api/pizzas/${pizzaId}`)
          .expect(404, { error: `Pizza doesn't exist.` });
      });
    });
    context(`Given there are pizzas in the database`, () => {
      beforeEach("insert pizzas", () => {
        helpers.seedPizzas(db, testPizzas);
      });

      it("responds with 200 and the selected order", () => {
        const pizzaId = 1;
        return supertest(app)
          .get(`/api/pizzas/${pizzaId}`)
          .expect(200);
      });
    });
  });

  describe(`POST /api/pizzas`, () => {
    context(`Given no pizzas`, () => {
      it(`responds with 201 and pizza object`, () => {
        const pizzaInfo = { size: "Small", type: "Cheese" };
        return supertest(app)
          .post(`/api/pizzas/`)
          .send(pizzaInfo)
          .expect(201, { id: 1, ...pizzaInfo });
      });
    });
  });

  describe(`PATCH /api/pizzas/:pizza_id`, () => {
    context(`Given there are pizzas in the database`, () => {
      beforeEach("insert pizzas", () => {
        helpers.seedPizzas(db, testPizzas);
      });

      it("responds with 204", () => {
        const pizzaInfo = { size: "Small", type: "Cheese" };
        return supertest(app)
          .patch("/api/pizzas/1")
          .send(pizzaInfo)
          .expect(204);
      });
    });
  });

  describe(`DELETE /api/pizzas/:pizza_id`, () => {
    context(`Given there are pizzas in the database`, () => {
      beforeEach("insert pizzas", () => {
        helpers.seedPizzas(db, testPizzas);
      });

      it("responds with 204", () => {
        return supertest(app)
          .del("/api/pizzas/1")
          .expect(204);
      });
    });
  });
});

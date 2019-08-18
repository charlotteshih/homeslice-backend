const knex = require("knex")
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe(`Restaurants Endpoints`, () => {
  let db;

  const { testRestaurants } = helpers.makeFixtures();
  const seedRestaurants = helpers.makeRestaurantsArray();

  before(`Make knex instance`, () => {
    db = knex({
      client: `pg`,
      connection: process.env.TEST_DB_URL
    });
    app.set(`db`, db);
  });

  after(`Disconnect from db`, () => db.destroy());
  before(`Cleanup`, () => helpers.cleanTables(db));
  afterEach(`Cleanup`, () => helpers.cleanTables(db));

  //doesn't pass because bcrypted passwords don't match
  describe.only(`GET /api/restaurants`, () => {
    context(`Given there are restaurants in the database`, () => {
      beforeEach(`Insert restaurants`, () => {
        helpers.seedRestaurants(db, seedRestaurants);
      });

      it(`Responds with 200 and all of the restaurants`, () => {
        return supertest(app)
          .get(`/api/restaurants`)
          .expect(200, testRestaurants);
      });
    });
  });

  describe(`GET /api/restaurants/:restaurant_id`, () => {
    //passes
    context(`Given no restaurants`, () => {
      it(`Responds with 404`, () => {
        const restaurantId = 12345;
        return supertest(app)
          .get(`/api/restaurants/${restaurantId}`)
          .expect(404, { "error": "Restaurant doesn't exist." });
      });
    });

    // doesn't pass because bcrypted passwords don't match
    context(`Given there are restaurants in the database`, () => {
      beforeEach(`Insert restaurants`, () => {
        helpers.seedRestaurants(db, seedRestaurants);
      });

      it(`Responds with 200 and the specified restaurant`, () => {
        console.log('seedRestaurants', seedRestaurants);
        return supertest(app)
          .get(`/api/restaurants/1`)
          .expect(200, seedRestaurants[0]);
      });
    });
  });

  // Doesn't pass because bcrypted passwords don't match
  describe(`POST /api/restaurants`, () => {
    context(`Given no restaurants`, () => {
      it(`Responds with 201 and a restaurant object`, () => {
        const restaurantInfo = {
          id: 1,
          name: "Test Restaurant",
          email: "test@homeslice.com",
          password: bcrypt.hashSync("ThisIs1Test!", 12),
          phone: "000-000-0000",
          street_address: "123 Test Restaurant Street",
          city: "Testville",
          state: "MA",
          zipcode: "99999"
        };

        return supertest(app)
          .post(`/api/restaurants`)
          .send(restaurantInfo)
          .expect(201, restaurantInfo);
      });
    });
  });

  // This test doesn't pass because it needs authorization
  describe(`PATCH /api/restaurants/:restaurant_id`, () => {
    context(`Given there are restaurants in the database`, () => {
      beforeEach(`Insert restaurants`, () => {
        helpers.seedRestaurants(db, seedRestaurants);
      });

      it(`Responds with 204`, () => {
        const restaurantInfo = {
          id: 1,
          name: "Test Restaurant",
          email: "test@homeslice.com",
          password: bcrypt.hashSync("ThisIs1Test!", 12),
          phone: "000-000-0000",
          street_address: "123 Test Restaurant Street",
          city: "Testville",
          state: "MA",
          zipcode: "99999"
        };

        return supertest(app)
          .patch(`/api/restaurants/1`)
          .send(restaurantInfo)
          .expect(204);
      });
    });
  });

  // passes
  describe(`DELETE /api/restaurants/:restaurant_id`, () => {
    context(`Given there are restaurants in the database`, () => {
      beforeEach(`Insert restaurants`, () => {
        helpers.seedRestaurants(db, seedRestaurants);
      });

      it(`Responds with 204`, () => {
        return supertest(app)
          .delete(`/api/restaurants/1`)
          .expect(204);
      });
    });
  });
});
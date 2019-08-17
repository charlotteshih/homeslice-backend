const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Restaurants Endpoints', () => {
  let db;

  const {
    testRestaurants,
    // testPizzas,
    // testCustomers,
    // testOrders
  } = helpers.makeFixtures();

  before('Make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('Disconnect from db', () => db.destroy());

  before('Cleanup', () => helpers.cleanTables(db));

  afterEach('Cleanup', () => helpers.cleanTables(db));

  describe('GET /api/restaurants', () => {
    context('Given no restaurants', () => {
      it('Responds with 200 and an empty list', () => {
        return supertest(app).get('/api/restaurants').expect(200, []);
      })
    });

    // context('Given there are restaurants in the database', () => {
    //   beforeEach('Insert restaurants', () => {});
    //   it('Responds with 200 and all the restaurants', () => {})
    // });

    context('Given an XSS attack restaurant', () => {
      const testRestaurant = helpers.makeRestaurantsArray()[1]
      const {
        maliciousRestaurant,
        expectedRestaurant
      } = helpers.makeMaliciousRestaurant(testRestaurant);

      beforeEach('Insert malicious restaurant', () => {
        return helpers.seedMaliciousRestaurant(db, testRestaurant, maliciousRestaurant)
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/api/restaurants')
          .expect(200)
          .expect(res => {
            expect(res.body[0].email).to.eql(expectedRestaurant.email);
            expect(res.body[0].street_address).to.eql(expectedRestaurant.street_address);
          });
      });
    });
  });

  // describe('POST /api/restaurants', () => {
  //   beforeEach('Insert restaurants', () => {});
  //   it('Creates a restaurant, responding with 201 and the new restaurant', () => {});
  // });

  describe('GET /api/restaurants/:restaurant_id', () => {
    context('Given restaurant with ID that doesn\'t exist', () => {
      beforeEach(() => {
        helpers.seedRestaurants(db, testRestaurants);
      });

      it('Responds with 404', () => {
        const restaurant_id = 123456;
        return supertest(app)
          .get(`/api/restaurants/${restaurant_id}`)
          // .get('Authorization', helpers.makeAuthHeader(testRestaurants[0]))
          .expect(404, { error: 'Restaurant doesn\'t exist.' });
      });
    });

    // context('Given there are restaurants in the database', () => {
    //   beforeEach('Insert restaurants', () => {});
    //   it('Responds with 200 and the specified restaurant', () => {});
    // });

    context('Given an XSS attack restaurant', () => {
      const testRestaurant = helpers.makeRestaurantsArray()[1]
      const {
        maliciousRestaurant,
        expectedRestaurant
      } = helpers.makeMaliciousRestaurant(testRestaurant);

      beforeEach('Insert malicious restaurant', () => {
        return helpers.seedMaliciousRestaurant(db, testRestaurant, maliciousRestaurant)
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/api/restaurants')
          .expect(200)
          .expect(res => {
            expect(res.body[0].email).to.eql(expectedRestaurant.email);
            expect(res.body[0].street_address).to.eql(expectedRestaurant.street_address);
          });
      });
    });
  });

  // describe('PATCH /api/restaurants/:restaurant_id', () => {
  //   context('Given restaurant with ID that does\'nt exist', () => {
  //     beforeEach(() => {});
  //     it('Responds with 404', () => {});
  //   });
  // });

  // describe('DELETE /api/restaurants/:restaurant_id', () => {
  //   context('Given restaurant with ID that does\'nt exist', () => {
  //     beforeEach(() => {});
  //     it('Responds with 404', () => {});
  //   });
  // });
});
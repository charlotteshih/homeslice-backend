const knex = require("knex")
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only(`Restaurants Endpoints`, () => {
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

  before(`Cleanup`, () => helpers.cleanTables(db));
  afterEach(`Cleanup`, () => helpers.cleanTables(db));
  after(`Disconnect from db`, () => db.destroy());

  describe(`GET /api/restaurants`, () => {
    context(`Given there are restaurants in the database`, () => {
      beforeEach(`Insert restaurants`, () => {
        helpers.seedRestaurants(db, seedRestaurants);
      });

      it(`Responds with 200 and all of the restaurants`, () => {
        return supertest(app)
          .get(`/api/restaurants`)
          .expect(200)
          .then(res => {
            const passwordStringArr = seedRestaurants.map(restaurant => restaurant.password);

            const hashStringArr = res.body.map(restaurant => restaurant.password);

            let pwMatchArr = []
            for (let i = 0; i < hashStringArr; i++) {
              pwMatchArr.push(bcrypt.compareSync(passwordStringArr[i], hashStringArr[i]));
            }
            return pwMatchArr;
          })
          .then(pwMatchArr => pwMatchArr.forEach(pwMatch => expect(pwMatch).to.be.true));
      });
    });
  });

  describe(`GET /api/restaurants/:restaurant_id`, () => {
    context(`Given no restaurants`, () => {
      it(`Responds with 404`, () => {
        const restaurantId = 12345;
        return supertest(app)
          .get(`/api/restaurants/${restaurantId}`)
          .expect(404, { "error": "Restaurant doesn't exist." });
      });
    });

    context(`Given there are restaurants in the database`, () => {
      beforeEach(`Insert restaurants`, () => {
        helpers.seedRestaurants(db, seedRestaurants);
      });

      it(`Responds with 200 and the specified restaurant`, () => {
        let password = seedRestaurants[1].password;
        console.log('seedRestaurants', seedRestaurants)

        return supertest(app)
          .get(`/api/restaurants/2`)
          .expect(200)
          .then(res => {
            let hashedPw = res.body.password;
            return bcrypt.compareSync(password, hashedPw);
          })
          .then(pwMatch => {
            expect(pwMatch).to.be.true;
          });
      });
    });
  });

  describe(`POST /api/restaurants`, () => {
    context(`Given no restaurants`, () => {
      it(`Responds with 201 and a restaurant object`, () => {
        const restaurantInfo = {
          id: 1,
          name: "Test Restaurant",
          email: "test@homeslice.com",
          password: "ThisIs1Test!",
          phone: "000-000-0000",
          street_address: "123 Test Restaurant Street",
          city: "Testville",
          state: "MA",
          zipcode: "99999"
        };

        const password = restaurantInfo.password

        return supertest(app)
          .post(`/api/restaurants`)
          .send(restaurantInfo)
          .expect(201)
          .then(res => {
            let hashedPw = res.body.password;
            return bcrypt.compareSync(password, hashedPw);
          })
          .then(pwMatch => {
            expect(pwMatch).to.be.true;
          });
      });
    });
  });

  describe(`PATCH /api/restaurants/:restaurant_id`, () => {
    context(`Given there are restaurants in the database`, () => {
      beforeEach(`Insert restaurants`, () => {
        helpers.seedRestaurants(db, seedRestaurants);
      });

      it(`Responds with 204`, () => {
        const restaurantInfo = {
          name: "Test Restaurant",
          state: "MA",
          zipcode: "99999"
        };

        let bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjFtYXJpb0BtYXJpb3NwaXp6YS5jb20iLCJpYXQiOjE1NjYxNzI4MTAsInN1YiI6IjFtYXJpb0BtYXJpb3NwaXp6YS5jb20ifQ.qrsogFV6gUlP2mJ6mxiTNTt1RJeWcX-F8hzy_CEWxVU';

        return supertest(app)
          .patch(`/api/restaurants/1`)
          .set('Authorization', `bearer ${bearerToken}`)
          .send(restaurantInfo)
          .expect(204);
      });
    });
  });

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
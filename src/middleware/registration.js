function hasEmailInDb(db, email) {
  return db("restaurants").where({ email })
    .then(restaurantQueryResult => {
      console.log('restaurants query', restaurantQueryResult);
      if (restaurantQueryResult.toString()) {
        return true;
      }
      return db("admin").where({ email });
    })
    .then(adminQueryResult => {
      console.log('admin query', adminQueryResult);
      if (adminQueryResult.toString()) {
        return true;
      }
      return db("customers").where({ email });
    })
    .then(customersQueryResult => {
      console.log('customersQuery', customersQueryResult);
      if(customersQueryResult.toString()) {
        return true
      }
      return false;
    });
}

function locateEmailInDb(db, email) {
  return db("restaurants")
    .where({ email })
    .then(queryResult => {
      if (queryResult) {
        return false;
      }
      return db("customer").where({ email });
    })
    .then(queryResult => {
      if (queryResult) {
        return false;
      }
      return db("admin").where({ email });
    })
    .then(userEmail => Boolean(userEmail));
}

module.exports = { hasEmailInDb, locateEmailInDb };

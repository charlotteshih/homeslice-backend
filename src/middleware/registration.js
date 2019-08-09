function hasEmailInDb(db, email) {
  return db("restaurants")
    .where({ email })
    .then(queryResult => {
      if (queryResult) {
        return true;
      }
      return db("admin").where({ email });
    })
    .then(queryResult => {
      if (queryResult) {
        return true;
      }
      return db("customers").where({ email });
    })
    .then(userEmail => Boolean(userEmail));
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

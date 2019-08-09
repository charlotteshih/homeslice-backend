const AdminService = require("../admin/admin-service");

function requireAdminAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";
  let bearerToken = "";

  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing bearer token." });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AdminService.verifyJwt(bearerToken);

    AdminService.getAdmin(req.app.get("db"), payload.sub)
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: "Unauthorized request." });
        }

        req.user = user;
        next();
      })
      .catch(err => {
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized request." });
  }
}

module.exports = { requireAdminAuth };

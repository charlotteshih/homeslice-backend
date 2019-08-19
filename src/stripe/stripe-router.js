const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const stripeRouter = express.Router();
const jsonBodyParser = express.json();

stripeRouter.route("/charge").post(jsonBodyParser, (req, res) => {
  stripe.charges
    .create({
      amount: 1000,
      currency: "usd",
      description: "An example charge",
      source: req.body.id
    })
    .then(charge => {
      // console.log('charge', charge)
      res.status(204);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = stripeRouter;

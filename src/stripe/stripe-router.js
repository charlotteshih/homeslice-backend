const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const stripeRouter = express.Router();

stripeRouter.post("/", (req, res) => {
  console.log("req.body", req.body);
  let charge = stripe.charges
    .create({
      amount: 0001,
      currency: "usd",
      description: "An example charge",
      source: req.body
    })
    .then(charge => {
      res.status(204).json({ charge });
    })
    .catch(err => res.status(500).json(err));
});

module.exports = stripeRouter;

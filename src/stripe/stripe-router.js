const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeRouter = express.Router();

stripeRouter
  .post("/", async (req, res) => {
    try {
      let { status } = await stripe.charges.create({
        amount: 0001,
        currency: "usd",
        description: "An example charge",
        source: req.body
      });
  
      res.status(204).json({ status });
      console.log(res);
    } catch (err) {
      res.status(500).end();
    }
  });

module.exports = stripeRouter;
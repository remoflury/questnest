import type Stripe from "stripe";

export type PricingPlan = {
  plan: Stripe.Product;
  price: Stripe.Price;
}
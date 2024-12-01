import type Stripe from "stripe";

export type PricingPlan = {
  supabasePlanId: number;
  plan: Stripe.Product;
  price: Stripe.Price;
}
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getSeo } from "$lib/server/data";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "$env/static/private";
import { error } from "console";
import type { PricingPlan } from "$lib/types/StripeTypes";


const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true
});


export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
  const { session } = await safeGetSession();
	if (session) {
		redirect(307, '/quests');
	}

  let plans: Stripe.Product[] = []
  let prices: Stripe.Price[] = []

  try {
    const {data: plansData } = await stripe.products.list({
      active: true
    })
    plans = plansData

    const { data: pricesData} = await stripe.prices.list({
      active: true
    })
    prices = pricesData

    console.log(pricesData)
  } catch(stripeErr) {
    console.error(stripeErr)
    error(500)
  }

  // Merge prices into plans
const mergedPlans: PricingPlan[] = plans.map(plan => {
  // Find the price that matches the plan's default_price
  const matchingPrice = prices.find(price => price.id === plan.default_price)!;
  
  return {
    plan,
    price: matchingPrice
  };
});
  

	return {
    plans: mergedPlans,
		seo: getSeo("/pricing")
	};
};
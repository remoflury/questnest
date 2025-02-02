import type { PricingPlan } from "$lib/types/StripeTypes";
import type { Tables } from "$lib/types/SupabaseTypes";
import { error, type RequestHandler } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY } from "$env/static/private";
import { genApiRes } from "$lib/utils/utils";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true
});

export const GET: RequestHandler = async ({ locals: { supabase }}) => {

  let plans: Stripe.Product[] = []
  let prices: Stripe.Price[] = []

  // get stripe data
  try {
    const {data: plansData } = await stripe.products.list({
      active: true
    })
    plans = plansData

    const { data: pricesData} = await stripe.prices.list({
      active: true
    })
    prices = pricesData

  } catch(stripeErr) {
    console.error(stripeErr)
    return genApiRes(undefined, "Something went wrong fetching the price plans.", 500)
  }

  // supabase planId 
  const { data: planData, error: planErr } = await supabase
    .from('plan')
    .select(`
        id, 
        stripe_price_id,
        user_plan (
          plan
        )
      `)
    .eq('active', true)
    .returns<(Pick<Tables<"plan">, 'id' | 'stripe_price_id'> & { user_plan: Pick<Tables<"user_plan">, "plan">[] })[]>()

    if (planErr) {
      console.error({ planErr })
      error(500)
    }

  // Merge prices into plans
  const mergedPlans: PricingPlan[] = plans.map(plan => {
    // Find the price that matches the plan's default_price
    const matchingPrice = prices.find(price => price.id === plan.default_price)!;
    const matchingSbId = planData!.find(id => id.stripe_price_id === plan.default_price)!;
    
    return {
      supabasePlanId: matchingSbId.id,
      plan,
      price: matchingPrice
    };
  });
  
  return genApiRes({
      mergedPlans, 
      usersPlanId: planData!.find(plan => plan.user_plan.length)?.user_plan[0].plan
    });
};
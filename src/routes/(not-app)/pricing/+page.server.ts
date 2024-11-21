import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getSeo } from "$lib/server/data";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "$env/static/private";
import { error } from "console";
import type { PricingPlan } from "$lib/types/StripeTypes";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { selectPricingPlanSchema } from "$lib/validation/stripeSchema";
import type { Tables } from "$lib/types/SupabaseTypes";


const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true
});


export const load: PageServerLoad = async ({ locals: { supabase }}) => {
  // const { session } = await safeGetSession();
	// if (session) {
	// 	redirect(307, '/quests');
	// }

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
    error(500)
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
    .returns<(Pick<Tables<"plan">, 'id' | 'stripe_price_id'> & { user_plan: Pick<Tables<"user_plan">, "plan">[] })[]>()

    if (planErr) {
      console.error({ planErr })
      error(500)
    }

  // Merge prices into plans
  const mergedPlans: PricingPlan[] = plans.map(plan => {
    // Find the price that matches the plan's default_price
    const matchingPrice = prices.find(price => price.id === plan.default_price)!;
    const matchingSbId = planData!.find(id => id.stripe_price_id === plan.default_price)!
    
    return {
      supabasePlanId: matchingSbId.id,
      plan,
      price: matchingPrice
    };
  });

  const selectPricingPlanForm = await superValidate(zod(selectPricingPlanSchema))

	return {
    selectPricingPlanForm,
    plans: mergedPlans,
    usersPlanId: planData!.find(plan => plan.user_plan.length)!.user_plan[0].plan,
		seo: getSeo("/pricing")
	};
};

export const actions: Actions = {
  selectplan: async ({ request, url, locals: { supabase, safeGetSession }}) => {
    const { session } = await safeGetSession()
    if (!session) {
      return fail(401)
    }

    const form = await superValidate(request, zod(selectPricingPlanSchema))

    if (!form.valid) {
      console.error({form})
      return message(form, "Ups, something went wrong.", { status: 403 })
    }

    const { data: planData, error: planErr } = await supabase
      .from('plan')
      .select('stripe_price_id')
      .eq("id", form.data.id)
      .single()

    if (planErr) {
      console.error({planErr})
      return message(form, "Something went wrong.", { status: 500 })
    }

    if (!planData) {
      console.error("Selected Plan does not exist.")
      return message(form, "Selected Plan does not exist.", { status: 403 })
    }

    // todo: if submitted plan is currently active plan, do nothing

    // create stripe session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${url.origin}${url.pathname}`,
      cancel_url: `${url.origin}${url.pathname}`,
      line_items: [
        {
          price: planData.stripe_price_id,
          quantity: 1
        }
      ],
      customer_email: session.user.email,
      mode: "payment",
      allow_promotion_codes: true,
      metadata: {
        userId: session.user.id
      }
    })

    if (!stripeSession || !stripeSession?.url) {
      console.error("Payment could not be processed.")
      return message(form, "Payment could not be processed.", { status: 403 }) 
    }

    redirect(301, stripeSession.url)
  }
};
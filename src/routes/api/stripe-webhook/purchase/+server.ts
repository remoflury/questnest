import type { RequestHandler } from "./$types";
import {type Stripe as StripeProps, Stripe } from "stripe";
import { json } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY } from "$env/static/private";
import { isEventOfDesiredType } from "$lib/server/stripeData";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true
});

export const POST: RequestHandler = async ({ request, locals: { adminSupabase } }) => {

  console.log(request)
  const stripeSignature = request.headers.get('stripe-signature');

  if (!stripeSignature) {
    return json("Signature failed.", {status: 401})
  }

  // // TODO: verify signature
  const body: StripeProps.Event = await request.json()

  console.log("purchase", body)
  
  if (!body || !body.id || !isEventOfDesiredType("purchase", body.type)) {
    return json("Request failed.", { status: 403}) 
  }

  const typedBody = body as StripeProps.CheckoutSessionCompletedEvent

  // get the associated productId
  let productData: StripeProps.LineItem
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(typedBody.data.object.id);
    productData = lineItems.data[0]
  } catch(error) {
    console.error({ error })
    return json("Something went wrong", {status: 403})
  }

  // get id of the purchased plan
  const { data: planData, error: planErr } = await adminSupabase
    .from('plan')
    .select('id')
    .eq('stripe_product_id', productData.price?.product)

  if (planErr) {
    console.error({planErr})
    return json(planErr.message, { status: 500})
  }

  // update users plan
  const { error: updateErr } = await adminSupabase
    .from('user_plan')
    .update({
      plan: planData[0].id
    })
    .eq("user", typedBody.data.object.metadata!.userId)

    
  if (updateErr) {
    console.error({ updateErr })
    return json(updateErr.message, { status: 500 })
  }
  
  return json("Purchase Webhook successful.");
}

// example body
// {
//   id: 'evt_1QNaQ8CxXQ9d4BuqCAeSRMtG',
//   object: 'event',
//   api_version: '2024-10-28.acacia',
//   created: 1732195664,
//   data: {
//     object: {
//       id: 'cs_test_a10W6KOLCBswvbpOB6ZKGCHsXxQll5jz7FF217AnsanISh7KHOH1nEcxG2',
//       object: 'checkout.session',
//       adaptive_pricing: [Object],
//       after_expiration: null,
//       allow_promotion_codes: null,
//       amount_subtotal: 995,
//       amount_total: 995,
//       automatic_tax: [Object],
//       billing_address_collection: null,
//       cancel_url: 'http://localhost:5173/pricing',
//       client_reference_id: null,
//       client_secret: null,
//       consent: null,
//       consent_collection: null,
//       created: 1732195641,
//       currency: 'chf',
//       currency_conversion: null,
//       custom_fields: [],
//       custom_text: [Object],
//       customer: null,
//       customer_creation: 'if_required',
//       customer_details: [Object],
//       customer_email: 'test@test.ch',
//       expires_at: 1732282041,
//       invoice: null,
//       invoice_creation: [Object],
//       livemode: false,
//       locale: null,
//       metadata: {},
//       mode: 'payment',
//       payment_intent: 'pi_3QNaPqCxXQ9d4Buq1oX60n5g',
//       payment_link: null,
//       payment_method_collection: 'if_required',
//       payment_method_configuration_details: [Object],
//       payment_method_options: {},
//       payment_method_types: [Array],
//       payment_status: 'paid',
//       phone_number_collection: [Object],
//       recovered_from: null,
//       saved_payment_method_options: null,
//       setup_intent: null,
//       shipping_address_collection: null,
//       shipping_cost: null,
//       shipping_details: null,
//       shipping_options: [],
//       status: 'complete',
//       submit_type: null,
//       subscription: null,
//       success_url: 'http://localhost:5173/pricing',
//       total_details: [Object],
//       ui_mode: 'hosted',
//       url: null
//     }
//   },
//   livemode: false,
//   pending_webhooks: 3,
//   request: { id: null, idempotency_key: null },
//   type: 'checkout.session.completed'
// }
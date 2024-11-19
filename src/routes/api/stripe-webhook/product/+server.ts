import type { RequestHandler } from "./$types";
// import { STRIPE_SECRET_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import Stripe from "stripe";

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
//   typescript: true
// });


export const POST: RequestHandler = async ({ request, locals: { adminSupabase } }) => {

    const stripeSignature = request.headers.get('stripe-signature');

    if (!stripeSignature) {
      return json("Signature failed.", {status: 403})
    }

    // TODO: verify signature
    const body: Stripe.Event = await request.json()

    if (!body || !body.id || (body.type !== "product.deleted" && body.type !== "product.created" && body.type !== "product.updated") ) {
      return json("Request failed.", {status: 403}) 
    }

    switch (body.type) {

      case ("product.created"): {
        const { error } = await adminSupabase
          .from('plan')
          .insert({
            stripe_product_id: body.data.object.id,
            stripe_price_id: body.data.object.id,
            active: body.data.object.active,
            title: body.data.object.name,
            description: body.data.object.description ? body.data.object.description : null
          })

          if (error) {
            console.log({ error })
          }
      }
      break;

      case ("product.updated"): {
        const { error } = await adminSupabase
          .from('plan')
          .update({
            stripe_product_id: body.data.object.id,
            stripe_price_id: body.data.object.default_price,
            active: body.data.object.active,
            title: body.data.object.name,
            description: body.data.object.description ? body.data.object.description : null
          })
          .eq("stripe_product_id", body.data.object.id)

          if (error) {
            console.log({ error })
          }
      }
      break;

      case ("product.deleted"): {
        const { error } = await adminSupabase
          .from('plan')
          .delete()
          .eq("stripe_product_id", body.data.object.id)

          if (error) {
            console.log({ error })
          }
      }
      break;
    }


  return json("Product Webhook successful.");
};

// product.created
// {
//   id: 'evt_1QMvTuCxXQ9d4BuqKUjmQ1X8',
//   object: 'event',
//   api_version: '2024-10-28.acacia',
//   created: 1732038294,
//   data: {
//     object: {
//       id: 'prod_RFQKTrLlRy8O9n',
//       object: 'product',
//       active: true,
//       attributes: [],
//       created: 1732038294,
//       default_price: null,
//       description: '(created by Stripe CLI)',
//       images: [],
//       livemode: false,
//       marketing_features: [],
//       metadata: {},
//       name: 'myproduct',
//       package_dimensions: null,
//       shippable: null,
//       statement_descriptor: null,
//       tax_code: null,
//       type: 'service',
//       unit_label: null,
//       updated: 1732038294,
//       url: null
//     }
//   },
//   livemode: false,
//   pending_webhooks: 3,
//   request: {
//     id: 'req_JsZgldgX6h1Xuk',
//     idempotency_key: 'f44d0079-ceaa-44b3-b8d6-766a0e870998'
//   },
//   type: 'product.created'
// }
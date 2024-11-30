import { isEventOfDesiredType } from "$lib/server/stripeData";
import type { RequestHandler } from "./$types";
// import { STRIPE_SECRET_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import type Stripe from "stripe";

// const stripe = new Stripe(STRIPE_SECRET_KEY, {
//   typescript: true
// });


export const POST: RequestHandler = async ({ request, locals: { adminSupabase } }) => {

    const stripeSignature = request.headers.get('stripe-signature');

    if (!stripeSignature) {
      return json("Signature failed.", {status: 401})
    }

    // TODO: verify signature
    const body: Stripe.Event = await request.json()

    // if (!body || !body.id || (body.type !== "product.deleted" && body.type !== "product.created" && body.type !== "product.updated") ) {
    if (!body || !body.id || !isEventOfDesiredType("product", body.type) ) {
      return json("Request failed.", {status: 403}) 
    }

    const typedBody = body as Stripe.ProductDeletedEvent | Stripe.ProductCreatedEvent | Stripe.ProductUpdatedEvent

    switch (typedBody.type) {

      case ("product.created"): {
        const { error } = await adminSupabase
          .from('plan')
          .insert({
            stripe_product_id: typedBody.data.object.id,
            stripe_price_id: typedBody.data.object.id,
            active: typedBody.data.object.active,
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
            stripe_product_id: typedBody.data.object.id,
            stripe_price_id: typedBody.data.object.default_price,
            active: typedBody.data.object.active,
          })
          .eq("stripe_product_id", typedBody.data.object.id)

          if (error) {
            console.log({ error })
          }
      }
      break;

      case ("product.deleted"): {
        const { error } = await adminSupabase
          .from('plan')
          .delete()
          .eq("stripe_product_id", typedBody.data.object.id)

          if (error) {
            console.log({ error })
          }
      }
      break;
    }


  return json("Product Webhook successful.");
};
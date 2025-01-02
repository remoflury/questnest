import type { RequestHandler } from "./$types";
import type Stripe from "stripe";
import { json } from "@sveltejs/kit";
import { isEventTypeValid } from "$lib/server/stripeData";

export const POST: RequestHandler = async ({ fetch, request, url }) => {
  const stripeSignature = request.headers.get('stripe-signature');

  if (!stripeSignature) {
    return json("Signature failed.", {status: 401})
  }

  const body: Stripe.Event = await request.json()
  
  if (!body || !body.id || !isEventTypeValid(body?.type)) {
    return json("Invalid Post Request.", { status: 403 })
  }
  
  const typedBody = body as Stripe.ProductDeletedEvent 
    | Stripe.ProductCreatedEvent
    | Stripe.ProductUpdatedEvent
    | Stripe.CheckoutSessionCompletedEvent


  // redirect depending on event type
  const fetchForRedirect = async (path: string) => {
    try {
      const res = await fetch(path, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          host: url.host,
          'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
          accept: '*/*; q=0.5, application/xml',
          'cache-control': 'no-cache',
          'content-type': 'application/json; charset=utf-8',
          'stripe-signature': stripeSignature,
          'accept-encoding': 'gzip'
        }
      })
      await res.json()
    } catch(error) {
      return json(error, { status: 500 })
    }
  }
  
  switch(typedBody.type) {
    case("product.created"):
    case("product.updated"):
    case("product.deleted"):
      await fetchForRedirect("/api/stripe-webhook/product")
      break;
    case ("checkout.session.completed"):
      await fetchForRedirect("/api/stripe-webhook/purchase")
      break;
  }

  return json("Successful Webhook Request")
};
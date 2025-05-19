import type Stripe from 'stripe';

type AllowedStripeEvents = Readonly<{
	endpoint: 'purchase' | 'product';
	allowedEventTypes: Stripe.Event.Type[];
}>;

/**
 * Gathers all used stripe events in one object,
 * so that in webhooks, it only can be mapped over
 */
const usedStripeEvents: AllowedStripeEvents[] = [
	{
		endpoint: 'product',
		allowedEventTypes: ['product.created', 'product.updated', 'product.deleted']
	},
	{
		endpoint: 'purchase',
		allowedEventTypes: ['checkout.session.completed']
	}
];

export const isEventOfDesiredType = (
	endpoint: AllowedStripeEvents['endpoint'],
	eventType: Stripe.Event.Type
): boolean => {
	return usedStripeEvents
		.find((e) => e.endpoint === endpoint)!
		.allowedEventTypes.includes(eventType)
		? true
		: false;
};

export const isEventTypeValid = (eventType: Stripe.Event.Type): boolean => {
	return usedStripeEvents.some((eventGroup) => eventGroup.allowedEventTypes.includes(eventType));
};

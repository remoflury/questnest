import type { Actions, PageServerLoad } from './$types';
import type { ApiResponse } from '$lib/types/GeneralTypes';
import type { PricingPlan } from '$lib/types/StripeTypes';
import { error, fail, redirect } from '@sveltejs/kit';
import { getSeo } from '$lib/server/data';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { selectPricingPlanSchema } from '$lib/validation/stripeSchema';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	typescript: true
});

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/pricing-plans');
	const {
		payload: { mergedPlans, usersPlanId },
		status,
		message
	}: ApiResponse<{
		mergedPlans: PricingPlan[];
		usersPlanId: number;
	}> = await res.json();

	if (status >= 400) {
		console.error({ status, message });
		error(status);
	}

	const selectPricingPlanForm = await superValidate(zod(selectPricingPlanSchema));

	return {
		selectPricingPlanForm,
		plans: mergedPlans,
		usersPlanId,
		seo: getSeo('/pricing')
	};
};

export const actions: Actions = {
	selectplan: async ({ request, url, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401);
		}

		const form = await superValidate(request, zod(selectPricingPlanSchema));

		if (!form.valid) {
			console.error({ form });
			return message(form, 'Ups, something went wrong.', { status: 403 });
		}

		const { data: planData, error: planErr } = await supabase
			.from('plan')
			.select('stripe_price_id')
			.eq('id', form.data.id)
			.single();

		if (planErr) {
			console.error({ planErr });
			return message(form, 'Something went wrong.', { status: 500 });
		}

		if (!planData) {
			console.error('Selected Plan does not exist.');
			return message(form, 'Selected Plan does not exist.', { status: 403 });
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
			mode: 'payment',
			allow_promotion_codes: true,
			metadata: {
				userId: session.user.id
			}
		});

		if (!stripeSession || !stripeSession?.url) {
			console.error('Payment could not be processed.');
			return message(form, 'Payment could not be processed.', { status: 403 });
		}

		redirect(301, stripeSession.url);
	}
};

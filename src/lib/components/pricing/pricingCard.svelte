<script lang="ts">
	import type { PricingPlan } from '$lib/types/StripeTypes';
	import type { SelectPricingPlanSchema } from '$lib/validation/stripeSchema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '../ui/button/button.svelte';
	import SelectPricingPlanForm from '../form/selectPricingPlanForm.svelte';
	import { page } from '$app/stores';

	type Props = {
		plan: PricingPlan;
		action: string;
		form: SuperValidated<Infer<SelectPricingPlanSchema>>;
		usersPlanId: number;
	};

	let { plan: data, action, form, usersPlanId }: Props = $props();
	let price = $derived(data.price);
	let plan = $derived(data.plan);
	let planId = $derived(data.supabasePlanId);
	let isFreePlan = $derived(price.unit_amount == 0);

	const renderPrice = (price: number | null, currency: string): string => {
		return `${price ? price / 100 : 0} ${currency.toLocaleUpperCase()}`;
	};
</script>

<Card.Root class="w-full {!isFreePlan ? 'border-primary' : ''}">
	<Card.Header>
		<Card.Title level={2}>{plan.name}</Card.Title>
		{#if plan.description}
			<Card.Description>{plan.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>
		{#if $page.data.session && usersPlanId == planId}
			<Button
				title="Sign in to get plan"
				aria-label="Sign in to get plan"
				disabled
				variant="secondary"
			>
				Currently active
			</Button>
		{:else if $page.data.session && usersPlanId != planId}
			<SelectPricingPlanForm data={form} {action} {planId} />
		{:else if !$page.data.session}
			<Button title="Sign in to get plan" aria-label="Sign in to get plan" href="/signin">
				Sign in to get plan
			</Button>
		{/if}

		<h4 class="h2 mt-4">{renderPrice(price.unit_amount, price.currency)}</h4>
	</Card.Content>
</Card.Root>

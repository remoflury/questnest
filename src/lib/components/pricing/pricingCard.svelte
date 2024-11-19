<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PricingPlan } from '$lib/types/StripeTypes';
	import Button from '../ui/button/button.svelte';

	type Props = {
		plan: PricingPlan;
	};

	let { plan: data }: Props = $props();
	let price = $derived(data.price);
	let plan = $derived(data.plan);

	$inspect(price);

	const renderPrice = (price: number | null, currency: string): string => {
		return `${price ? price / 100 : 0} ${currency.toLocaleUpperCase()}`;
	};
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title level={2}>{plan.name}</Card.Title>
		{#if plan.description}
			<Card.Description>{plan.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>
		<Button class="w-full">Some thing</Button>
		<h4 class="h2 mt-4">{renderPrice(price.unit_amount, price.currency)}</h4>
	</Card.Content>
</Card.Root>

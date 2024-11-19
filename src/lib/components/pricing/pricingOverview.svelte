<script lang="ts">
	import type { PricingPlan } from '$lib/types/StripeTypes';
	import PricingCard from './pricingCard.svelte';

	type Props = {
		plans: PricingPlan[];
	};

	let { plans }: Props = $props();
</script>

<div class="grid-spacing grid grid-cols-2">
	{#each plans as plan (crypto.randomUUID())}
		<PricingCard {plan} />
	{/each}
</div>

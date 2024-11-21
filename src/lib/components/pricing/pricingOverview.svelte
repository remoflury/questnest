<script lang="ts">
	import type { PricingPlan } from '$lib/types/StripeTypes';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { SelectPricingPlanSchema } from '$lib/validation/stripeSchema';
	import PricingCard from './pricingCard.svelte';

	type Props = {
		plans: PricingPlan[];
		action: string;
		form: SuperValidated<Infer<SelectPricingPlanSchema>>;
		usersPlanId: number;
	};

	let { plans, action, form, usersPlanId }: Props = $props();
</script>

<div class="grid-spacing grid grid-cols-2">
	{#each plans as plan (crypto.randomUUID())}
		<PricingCard {plan} {action} {form} {usersPlanId} />
	{/each}
</div>

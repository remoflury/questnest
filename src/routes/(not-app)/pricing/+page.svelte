<script>
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';

	import Seo from '$lib/components/general/seo.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import PricingOverview from '$lib/components/pricing/pricingOverview.svelte';

	let { data } = $props();
</script>

<Seo pageSeo={data.seo} />
<FadeInWrapper class="section-spacing container" tag="section">
	<article class="grid-content grid-spacing">
		<TitleWrapper tag="h1">
			{#snippet text()}
				Our Pricing Plans
			{/snippet}
		</TitleWrapper>
		<PricingOverview plans={data.plans} action="?/selectplan" form={data.selectPricingPlanForm} />
	</article>
</FadeInWrapper>

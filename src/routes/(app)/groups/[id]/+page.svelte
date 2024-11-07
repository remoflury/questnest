<script lang="ts">
	import SearchPersons from '$lib/components/form/searchPersons.svelte';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';

	let { data } = $props();
</script>

<FadeInWrapper class="section-t-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			{data.group.name}
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<FadeInWrapper tag="section" class="section-spacing container">
	<SearchPersons />
</FadeInWrapper>

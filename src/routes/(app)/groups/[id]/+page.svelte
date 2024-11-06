<script lang="ts">
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus } from 'lucide-svelte';

	let { data } = $props();
</script>

<FadeInWrapper class="section-t-spacing container" tag="section">
	<TitleWrapper tag="h1">
		{#snippet text()}
			{data.group.name}
		{/snippet}
	</TitleWrapper>
</FadeInWrapper>

<script lang="ts">
	import { page } from '$app/stores';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<FadeInWrapper class="section-spacing container" tag="section">
	<article class="grid-content grid-spacing">
		<TitleWrapper tag="h1">
			{#snippet text()}
				Ups, something went wrong.
			{/snippet}
		</TitleWrapper>
		<p>
			{#if $page.status >= 500}
				{$page.status}: Our servers seems to have trouble. Try again later.
			{:else}
				{$page.status}: The page could not be found.
			{/if}
		</p>
		<Button class="max-w-max" href="/" title="go to home" aria-label="go to home">Home</Button>
	</article>
</FadeInWrapper>

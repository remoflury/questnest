<script lang="ts">
	import { page } from '$app/stores';
	import FadeInWrapper from '$lib/components/general/FadeInWrapper.svelte';
	import Seo from '$lib/components/general/seo.svelte';
	import TitleWrapper from '$lib/components/general/titleWrapper.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { SeoProps } from '$lib/types/GeneralTypes';

	let pageSeo: SeoProps = $state({
		seoPageTitle: `${$page.status} | Error`,
		seoPageDescription: 'Something went wrong.'
	});
</script>

<Seo {pageSeo} />

<FadeInWrapper class="section-spacing container" tag="section">
	<article class="grid-content grid-spacing">
		<TitleWrapper tag="h1">
			{#snippet text()}
				Ups, something went wrong.
			{/snippet}
		</TitleWrapper>
		<p>
			{#if $page.status >= 500}
				{$page.status}: Our server seems to have trouble. Try again later.
			{:else if $page.status == 401}
				{$page.status}: You are not authorized to access this page. Please log in.
			{:else}
				{$page.status}: The page could not be found.
			{/if}
		</p>
		<Button
			class="max-w-max"
			href={$page.status == 401 ? '/signin' : '/'}
			title="go to {$page.status == 401 ? 'Login page' : 'home'}"
			aria-label="go to {$page.status == 401 ? 'Login page' : 'home'}"
			>{$page.status == 401 ? 'Sign In' : 'Home'}</Button
		>
	</article>
</FadeInWrapper>

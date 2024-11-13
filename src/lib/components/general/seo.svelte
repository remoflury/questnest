<script lang="ts">
	import type { SeoProps } from '$lib/types/GeneralTypes';
	import { page } from '$app/stores';

	type Props = {
		pageSeo: SeoProps;
	};
	let { pageSeo: s }: Props = $props();

	const author = 'Remo Flury | www.remoflury.ch';
</script>

<svelte:head>
	<title>{s.seoPageTitle}</title>
	<meta name="description" content={s.seoPageDescription} />

	{#if s.seoKeywords}
		<meta name="keywords" content={s.seoKeywords} />
	{/if}
	<meta name="keywords" content={s.seoCanonical ?? $page.url.href} />
	{#if s.seoRobots?.length}
		<meta name="robots" content={s.seoRobots.join(', ')} />
	{/if}

	<meta name="og:title" content={s.ogTitle ?? s.seoPageTitle} />
	<meta name="og:description" content={s.ogDescription ?? s.seoPageDescription} />
	<meta name="og:url" content={s.ogUrl ?? $page.url.href} />
	{#if s.ogImage}
		<meta name="og:image" content={s.ogImage} />
	{/if}

	<meta name="copyright" content={author} />
	<meta name="author" content={author} />
	<meta name="designer" content={author} />
	<meta name="owner" content={author} />
</svelte:head>

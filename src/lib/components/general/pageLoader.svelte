<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { TRANSITION_CONFIG } from '$lib/utils/constants';
	import { LoaderCircle } from 'lucide-svelte';
	import { scale } from 'svelte/transition';

	let isLoading = $state(false);
	let scrollY = $state(0);

	beforeNavigate(async () => {
		isLoading = true;
	});
	afterNavigate(() => (isLoading = false));

	$effect(() => {
		if (browser) document.body.classList.toggle('overflow-hidden', isLoading);
	});
</script>

<svelte:window bind:scrollY />
{#if isLoading}
	<div
		aria-busy="true"
		class="pointer-events-none absolute left-0 right-0 z-50 grid place-content-center"
		style="top: calc(40dvh + {scrollY}px)"
		transition:scale={TRANSITION_CONFIG}
	>
		<LoaderCircle size={48} class="animate-spin stroke-primary stroke-1" />
	</div>
{/if}
